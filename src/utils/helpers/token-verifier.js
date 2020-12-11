const MissingParamError = require('../errors/missing-param-error')
const jwt = require('jsonwebtoken')

module.exports = class TokenVerifier {
  constructor (secret) {
    this.secret = secret
  }

  async inspector (token) {
    if (!token) {
      throw new MissingParamError('token')
    }

    if (!this.secret) {
      throw new MissingParamError('secret')
    }

    const authorized = jwt.verify(token, this.secret)
    return authorized
  }
}
