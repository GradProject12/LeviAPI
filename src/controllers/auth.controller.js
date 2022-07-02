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
    certificate_image: req.body.certificate_image,
    secret: secret,
    clinic_location: req.body.clinic_location,
    working_schedule: req.body.working_schedule,
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

    if (user.phone && !/(01[0-2]|015)\d{8}$/.test(user.phone))
      throw new Error("phone number is not valid");

    if (user.role === "doctor") {
      if (
        req.body.working_schedule &&
        !validator.isJSON(req.body.working_schedule, [])
      ) {
        throw new Error("working schedule must be of type json ");
      }
      if (user.national_id && user.national_id.length != 14)
        throw new Error("national id must be 14 number ");
      if (req.files.length) {
        let path = [];
        req.files.map((file) => {
          path.push(`${file.path}`);
        });
        user.certificate_image = path;
      }
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
      .json(successRes(201, null, "Verification code is sent to your email"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
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
    const verifiedUser = await userStore.checkVerified(user.email);
    if (await verifiedUser.verified) {
      return res
        .status(409)
        .json(successRes(409, null, "Account already verified"));
    }
    const setVerifie = await userStore.setVerified(user.email);

    const verify = speakeasy.totp.verify({
      secret: setVerifie.secret,
      encoding: "base32",
      token: user.otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      await userStore.setVerified(user.email);
      res
        .status(200)
        .json(successRes(200, null, "Account Verified Successifully"));
    } else res.status(400).json(successRes(400, null, "Wrong OTP"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
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
        .status(401)
        .json(successRes(401, null, "Account is not verified"));

    if (loggeduser.role === "doctor") {
      const isAccepted = await doctorStore.isAccepted(user.email);
      if (!(await isAccepted.accepted_status)) {
        return res
          .status(401)
          .json(successRes(401, null, "You are still in the waiting list"));
      }
    }
    const token = jwt.sign(
      { email: loggeduser.email, userId: loggeduser.user_id },
      process.env.TOKEN_SERCRET
      // {
      //   expiresIn: "30m",
      // }
    );
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
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
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
    if (newuser.verified)
      return res
        .status(409)
        .json(successRes(409, null, "Account already verified"));

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
    res.status(200).json(successRes(200, null, "Token is sent to your email"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));

    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.forgetPassword = async (req, res) => {
  const secret = speakeasy.generateSecret().base32;
  const { email } = req.body;
  try {
    const exist = await userStore.emailExist(email);
    if (!exist)
      return res.status(400).json(successRes(400, null, "Email doesn't exist"));
    await userStore.storePasswordResetToken(secret, email);
    const otp = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    sendMail(
      "Password Reset",
      `
        <p>Your password reset code is <b>${otp}</b></p>
        `,
      email
    );
    res
      .status(201)
      .json(successRes(201, null, "Password reset code is sent to your email"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.verifyPasswordReset = async (req, res) => {
  const { otp, email } = req.body;
  try {
    if (!email) {
      const error = new Error("email is missing");
      error.code = 422;
      throw error;
    }
    if (!otp) {
      const error = new Error("otp is missing");
      error.code = 422;
      throw error;
    }

    const setVerifie = await userStore.checkResetToken(email);

    const verify = speakeasy.totp.verify({
      secret: setVerifie.reset_token,
      encoding: "base32",
      token: otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      await userStore.setVerified(email);
      res.status(200).json(successRes(200, null, "Token confirmed"));
    } else res.status(400).json(successRes(400, null, "Wrong OTP"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.resetPassword = async (req, res) => {
  const { otp, password, confirm_password, email } = req.body;
  try {
    if (!otp) {
      const error = new Error("otp is missing");
      error.code = 422;
      throw error;
    }
    const setVerifie = await userStore.checkResetToken(email);

    const verify = speakeasy.totp.verify({
      secret: setVerifie.reset_token,
      encoding: "base32",
      token: otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      if (!password) {
        const error = new Error("password is missing");
        error.code = 422;
        throw error;
      }
      if (!confirm_password) {
        const error = new Error("confirm password is missing");
        error.code = 422;
        throw error;
      }
      if (password !== confirm_password)
        res.status(400).json(errorRes(400, "Password doesn't match!"));
      await userStore.updatePassword(email, password);
      return res
        .status(200)
        .json(successRes(200, null, "Password changed successfully"));
    } else res.status(400).json(successRes(400, null, "Wrong OTP"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

exports.changePassword = async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;
  try {
    if (!old_password) {
      const error = new Error("old password is missing");
      error.code = 422;
      throw error;
    }
    if (!new_password) {
      const error = new Error("new password is missing");
      error.code = 422;
      throw error;
    }
    if (!confirm_password) {
      const error = new Error("confirm password is missing");
      error.code = 422;
      throw error;
    }
    if (new_password !== confirm_password)
      res.status(400).json(errorRes(400, "Password doesn't match!"));
    await userStore.checkOldPassword(req.params.user_id, old_password);
    await userStore.changePassword(new_password, req.params.user_id);
    return res
      .status(200)
      .json(successRes(200, null, "Password changed successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
