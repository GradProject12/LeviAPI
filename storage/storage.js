const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CloudinaryDemo",
    resource_type: "auto",
    allowedFormats: ["jpeg", "png", "jpg", "wave", "mp3"],
  },
});

module.exports = {
  cloudStorage,
};
