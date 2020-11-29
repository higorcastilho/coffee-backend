module.exports = class InvalidParamError extends Error {
  constructor (param) {
    super('')
    this.name = 'Invalid'
  }
}
