const multer = require("multer");
const { errorRes } = require("./response");
const { cloudStorage } = require('../../storage/storage');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "application/pdf" ||
    file.mimetype == "application/vnd.ms-excel" ||
    file.mimetype == "application/msword" ||
    file.mimetype == "text/plain"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    const err = new Error(
      "Only .png, .jpg, .jpeg, .pdf, .doc and .txt format allowed!"
    );
    err.name = "ExtensionError";
    return cb(err);
  }
};

exports.fileUploadd = (name) => (req, res, next) => {
  const upload = multer({
    storage: cloudStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  }).array(name, 10);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json(errorRes(400, err));
    } else if (err) {
      return res.status(400).json(errorRes(400, err.message));
    }
    next();
  });
};

exports.multipleUpload = (arr) => (req, res, next) => {
  const field = arr.map((att) => {
    return { name: att, maxCount: 1 };
  });
  const upload = multer({
    storage: cloudStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  }).fields(field);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.message === "Unexpected field")
        return res
          .status(400)
          .json(errorRes(400, "You uploaded to a wrong field"));
    } else if (err) {
      return res.status(400).json(errorRes(400, err.message));
    }
    next();
  });
};

exports.uploadFinal = (name) => (req, res, next) => {
  const upload = multer({
    storage: cloudStorage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single(name);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json(errorRes(400, err));
    } else if (err) {
      return res.status(400).json(errorRes(400, err.message));
    }
    next();
  });
};