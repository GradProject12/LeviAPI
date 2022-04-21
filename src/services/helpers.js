const nodemailer = require("nodemailer");

function sendMail(subject,body,to) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    service: "yahoo",
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  message = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: body,
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

const stringBetweenParentheses = (st) => {
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(st);
    return matches[1];
  };
  module.exports = {stringBetweenParentheses,sendMail };