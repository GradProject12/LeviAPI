const DoctorStore = require("../models/doctor");
const ParentStore = require("../models/parent");
const UserStore = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const speakeasy = require("speakeasy");
const { sendMail } = require("../services/helpers");
const { successRes, errorRes } = require("../services/response");

const doctorStore = new DoctorStore();
const parentStore = new ParentStore();
const userStore = new UserStore();

exports.signup = async (req, res) => {
  const secret = speakeasy.generateSecret().base32;
  const user = {
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
    doctor_id: req.body.doctor_id,
    role: req.body.role,
  };
  try {
    if (!user.role) {
      const error = new Error("role is missing");
      error.code = 422;
      throw error;
    }
    if (!(user.role === "doctor" || user.role === "parent"))
      throw new Error("Invaild role");
    if (!user.email) {
      const error = new Error("email is missing");
      error.code = 422;
      throw error;
    }
    if (!user.full_name) {
      const error = new Error("full name is missing");
      error.code = 422;
      throw error;
    }

    if (!user.password) {
      const error = new Error("password is missing");
      error.code = 422;
      throw error;
    }

    if (!validator.isEmail(user.email))
      throw new Error("email address is not valid ");

    if (user.password.length < 8)
      throw new Error("password must be at least 8 characters ");

    if (user.profile_image && !validator.isURL(user.profile_image, []))
      throw new Error("image path is not valid");

    if (user.phone && !/(01[0-2]|015)\d{8}$/.test(user.phone))
      throw new Error("phone number is not valid");

    if (user.role === "doctor") {
      if (
        user.start_time &&
        !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(user.start_time)
      )
        throw new Error("start time is not valid time");

      if (
        user.end_time &&
        !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(user.end_time)
      )
        throw new Error("end time is not valid time");
      if (user.national_id && user.national_id.length != 14)
        throw new Error("national id must be 14 number ");
      await doctorStore.create(user);
    } else if (user.role === "parent") await parentStore.create(user);

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
      user.email
    );
    res
      .status(201)
      .json(successRes(201, [], "Verification code is sent to your email"));
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.verify = async (req, res) => {
  const user = {
    email: req.body.email,
    otp: req.body.otp,
  };

  try {
    if (!user.email) {
      const error = new Error("email is missing");
      error.code = 422;
      throw error;
    }
    if (!user.otp) {
      const error = new Error("otp is missing");
      error.code = 422;
      throw error;
    }

    const verifiedUser = await userStore.setVerified(user.email);
    if (verifiedUser.verified)
      return res
        .status(409)
        .json(successRes(409, [], "Account already verified"));
    const verify = speakeasy.totp.verify({
      secret: verifiedUser.secret,
      encoding: "base32",
      token: user.otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      await store.setVerified(user.email);
      res
        .status(200)
        .json(successRes(200, [], "Account Verified Successifully"));
    } else res.status(400).json(successRes(400, [], "Wrong OTP"));
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    if (!user.email) {
      const error = new Error("email is missing");
      error.code = 422;
      throw error;
    }
    if (!user.password) {
      const error = new Error("password is missing");
      error.code = 422;
      throw error;
    }
    const loggeduser = await userStore.login(user.email, user.password);
    if (!loggeduser.verified)
      return res
        .status(400)
        .json(successRes(400, [], "Account is not verified"));
    const token = jwt.sign({ loggeduser }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.status(200).json(
      successRes(
        200,
        {
          id: loggeduser.user_id,
          token,
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.sendCode = async (req, res) => {
  const user = {
    email: req.body.email,
  };
  try {
    if (!user.email) {
      const error = new Error("email is missing");
      error.code = 422;
      throw error;
    }

    if (!validator.isEmail(user.email))
      throw new Error("email address is not valid ");

    const newuser = await userStore.isVerified(user.email);
    if (newuser)
      return res
        .status(409)
        .json(successRes(409, [], "Account already verified"));

    const otp = speakeasy.totp({
      secret: newuser.secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    sendMail(
      "Signup Verification",
      `Your Verification Code is ${otp}
      Please note that it will expire in 5 mins.
      `,
      user.email
    );
    res.status(200).json(successRes(200, [], "Token is sent to your email"));
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));

    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
// exports.logout = async (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 1 });
//     res.status(200).json(successRes(200, [], "Logged out successfully"));
//   } catch (error) {
//     res.status(400);
//     res.json(errorRes(400, error.message));
//   }
// };
