const multer = require("multer");
const { errorRes } = require("./response");
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).array("file", 10);

exports.fileUploadd = (req, res,next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json(errorRes(400, err));
    } else if (err) {
      console.log(err);
      res.status(400).json(errorRes(400, err.message));
    }
    next()
  });
};