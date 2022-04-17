const successRes = (code, data, message) => {
  return {
    status: "success",
    code: code,
    data: data,
    message: message,
  };
};

const errorRes = (code,message) => {
  return {
    status: "error",
    code:code,
    message: message,
  };
};

module.exports = {successRes,errorRes}
