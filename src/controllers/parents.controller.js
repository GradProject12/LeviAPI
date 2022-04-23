const ParentStore = require("../models/parent");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");
const speakeasy = require("speakeasy");
const { sendMail } = require("../services/helpers");

const store = new ParentStore();

const index = async (_req, res) => {
  try {
    const parents = await store.index();
    res.status(200).json(successRes(200, parents));
    if (!parents.length)
      return res.status(200).json(successRes(200, [], "Nothing exits"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const parent = await store.show(req.params.id);
    const { user_id, password, verified, secret, ...rest } = parent;
    res.status(200).json(successRes(200, rest));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const secret = speakeasy.generateSecret().base32;
  const parent = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    secret: secret,
    doctor_id: req.body.doctor_id,
  };
  try {
    if (!parent.email) throw new Error("email address is missing");
    if (!parent.full_name) throw new Error("full name is missing");
    if (!parent.password) throw new Error("password is missing");

    if (!validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.profile_image && !validator.isURL(parent.profile_image, []))
      throw new Error("image path is not valid");

    const newParent = await store.create(parent);
    const token = jwt.sign({ parent: newParent }, process.env.TOKEN_SERCRET);
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
      parent.email
    );
    res
      .status(200)
      .json(
        successRes(
          200,
          { email: parent.email, token: token },
          "Verification code is sent to your email"
        )
      );
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const verify = async (req, res) => {
  const parent = {
    email: req.body.email,
    otp: req.body.otp,
  };

  try {
    const parentt = await store.verifyData(parent.email);
    if (parentt.verified)
      return res
        .status(200)
        .json(successRes(200, [], "Account already verified"));
    const verify = speakeasy.totp.verify({
      secret: parentt.secret,
      encoding: "base32",
      token: parent.otp,
      digits: 5,
      step: 300,
    });
    if (verify) {
      await store.setVerified(parent.email);
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
  const parent = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    doctor_id: req.body.doctor_id,
  };
  try {
    if (parent.email && !validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password && parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.profile_image && !validator.isURL(parent.profile_image, []))
      throw new Error("image path is not valid");
    const parent2 = await store.update(parent, req.params.id);
    res
      .status(200)
      .json(successRes(200, parent2, "Account is updated successfully"));
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
  const parent = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const loggedParent = await store.login(parent.email, parent.password);
    if (!loggedParent.verified)
      return res
        .status(200)
        .json(successRes(200, [], "Account is not verified"));
    const token = jwt.sign({ loggedParent }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.status(200).json(
      successRes(
        200,
        {
          id: loggedParent.user_id,
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
  const parent = {
    email: req.body.email,
  };
  try {
    if (!parent.email) throw new Error("email address is missing");

    if (!validator.isEmail(parent.email))
      throw new Error("email address is not valid ");

    const newParent = await store.verifyData(parent.email);
    const otp = speakeasy.totp({
      secret: newParent.secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    sendMail(
      "Signup Verification",
      `Your Verification Code is ${otp}
    Please note that it will expire in 5 mins.
    `,
      parent.email
    );
    res.status(200).json(successRes(200, [], "Token is sent to your email"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

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
