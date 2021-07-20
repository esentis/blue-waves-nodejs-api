module.exports = {
  isAlphaNumericOnly: function (input) {
    var letterNumberRegex = /^[0-9a-zA-Z]+$/;
    if (input.match(letterNumberRegex)) {
      return true;
    }
    return false;
  },
  isGoodPassword: function (input) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return regex.test(input);
  },
};
