const successRes = (code, data, message, meta) => {
  const res = {
    status: "success",
    code: code,
    message: message,
    meta:meta,
    data:data
  };

  return res
  
};

const errorRes = (code, message) => {
  return {
    status: "error",
    code: code,
    message: message,
    data:null
  };
};

module.exports = { successRes, errorRes };
