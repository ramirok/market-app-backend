// general error
function generalError(message) {
  this.message = message;

  this.getCode = function () {
    if (this instanceof badRequestError) {
      return 400;
    }
    return 409;
  };
}
generalError.prototype = new Error();

// bad request error
function badRequestError(message) {
  this.message = message;
}
badRequestError.prototype = new generalError();

module.exports = { generalError, badRequestError };
