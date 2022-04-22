const DoctorStore = require("../models/doctor");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");
const speakeasy = require("speakeasy");
const { sendMail } = require("../services/helpers");

const store = new DoctorStore();

const index = async (_req, res) => {
  try {
    const doctors = await store.index();
    if (!doctors.length)
      return res.status(200).json(successRes(200, [], "Nothing exits"));
    res.status(200).json(successRes(200, doctors));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const doctor = await store.show(req.params.id);
    const { user_id, password, verified, secret, ...rest } = doctor;
    res.status(200).json(successRes(200, rest));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const secret = speakeasy.generateSecret().base32;
  const doctor = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    secret: secret,
    clinic_location: req.body.clinic_location,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    days_of_week: req.body.days_of_week,
    national_id: req.body.national_id,
  };
  try {
    if (!doctor.email) throw new Error("email address is missing");

    if (!doctor.full_name) throw new Error("full name is missing");

    if (!doctor.password) throw new Error("password is missing");

    if (
      doctor.start_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.start_time)
    )
      throw new Error("start time is not valid time");

    if (
      doctor.end_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.end_time)
    )
      throw new Error("end time is not valid time");

    if (!validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");

    if (doctor.password.length < 8)
      throw new Error("password must be at least 8 characters ");

    if (doctor.profile_image && !validator.isURL(doctor.profile_image, []))
      throw new Error("image path is not valid");

    if (
      doctor.phone &&
      !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(doctor.phone)
    )
      throw new Error("phone number is not valid");

    const newdoctor = await store.create(doctor);
    const token = jwt.sign({ doctor: newdoctor }, process.env.TOKEN_SERCRET);
    const otp = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    sendMail(
      "Signup Verification",
      `Your Verification Code is ${otp}
    Please note that it will expire in 5 mins.
    `,
      doctor.email
    );
    res
      .status(201)
      .json(
        successRes(
          201,
          { email: doctor.email, token: token },
          "Verification code is sent to your email"
        )
      );
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const verify = async (req, res) => {
  const doctor = {
    email: req.body.email,
    otp: req.body.otp,
  };

  try {
    const doc = await store.verifyData(doctor.email);
    if (doc.verified)
      return res
        .status(200)
        .json(successRes(200, [], "Account already verified"));
    const verify = speakeasy.totp.verify({
      secret: doc.secret,
      encoding: "base32",
      token: doctor.otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      await store.setVerified(doctor.email);
      res
        .status(200)
        .json(successRes(200, [], "Account Verified Successifully"));
    } else res.status(200).json(successRes(200, [], "Wrong OTP"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const update = async (req, res) => {
  const doctor = {
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    clinic_location: req.body.clinic_location,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    days_of_week: req.body.days_of_week,
  };
  try {
    if (doctor.email && !validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");
    if (doctor.password && doctor.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (doctor.image && !validator.isURL(doctor.image, []))
      throw new Error("image path is not valid");
    if (
      doctor.phone &&
      !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(doctor.phone)
    )
      throw new Error("phone number is not valid");

    if (
      doctor.start_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.start_time)
    )
      throw new Error("start time is not valid time");

    if (
      doctor.end_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.end_time)
    )
      throw new Error("end time is not valid time");

    const doctorn = await store.update(doctor, req.params.id);
    res
      .status(200)
      .json(successRes(200, doctorn, "Account is updated successfully"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    await store.delete(req.params.id);
    res
      .status(200)
      .json(successRes(200, [], "Account is removed successfully"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const login = async (req, res) => {
  const doctor = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const loggedDoctor = await store.login(doctor.email, doctor.password);
    if (!loggedDoctor.verified)
      return res
        .status(200)
        .json(successRes(200, [], "Account is not verified"));
    const token = jwt.sign({ loggedDoctor }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.status(200).json(
      successRes(
        200,
        {
          email: loggedDoctor.email,
          role: loggedDoctor.role,
          token,
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const sendCode = async (req, res) => {
  const doctor = {
    email: req.body.email,
  };
  try {
    if (!doctor.email) throw new Error("email address is missing");

    if (!validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");

    const newDoctor = await store.verifyData(doctor.email);
    const otp = speakeasy.totp({
      secret: newDoctor.secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    sendMail(
      "Signup Verification",
      `Your Verification Code is ${otp}
    Please note that it will expire in 5 mins.
    `,
      doctor.email
    );
    res.status(200).json(successRes(200, [], "Token is sent to your email"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

// const forgetPassword = (req, res) => {
//   const { email } = req.body;
//   const doctor = await store.verifyData(email);
//   const token = jwt.sign({ doctor: newdoctor }, process.env.TOKEN_SERCRET);

//   const otp = speakeasy.totp({
//     secret: token,
//     digits: 5,
//     encoding: "base32",
//     step: 300,
//   });
//   await store.forget(doctor.email,token)
// };

module.exports = {
  index,
  show,
  create,
  update,
  remove,
  login,
  verify,
  sendCode,
};
