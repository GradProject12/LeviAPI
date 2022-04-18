const stringBetweenParentheses = (st) => {
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(st);
    return matches[1];
  };
  module.exports = {stringBetweenParentheses };