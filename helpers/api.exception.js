class APIException extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.message = message
  }

  static Validate(errors) {
    let message = errors.map(item => item.msg)[ 0 ]
    return new APIException(400, message)
  }

  static Request(message) {
    return new APIException(401, message)
  }
}

module.exports = APIException