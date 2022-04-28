const successRes = (code, data, message, meta) => {
  const res = {
    status: "success",
    code: code,
    message: message,
    meta:meta
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
