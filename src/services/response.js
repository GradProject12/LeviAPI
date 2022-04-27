const successRes = (code, data, message) => {
  const res = {
    status: "success",
    code: code,
    message: message,
  };
  if (data) res.data = data;
  return res;
};

const errorRes = (code, message) => {
  return {
    status: "error",
    code: code,
    message: message,
  };
};

module.exports = { successRes, errorRes };
