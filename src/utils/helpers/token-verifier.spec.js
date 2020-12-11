const MissingParamError = require('../errors/missing-param-error')
const jwt = require('jsonwebtoken')
const TokenVerifier = require('./token-verifier')

jest.mock('jsonwebtoken', () => ({
  secret: 'secret',
  token: '',
  decoded: {},
  verify (token, secret) {
    this.token = token
    this.secret = secret
    return this.decoded
  }
}))

const makeSut = () => {
  return new TokenVerifier('secret')
}

describe('Token Verifier', () => {
  test('Should return false if JWT returns false', async () => {
    const sut = makeSut()
    jwt.decoded = false
    const authorized = await sut.inspector('any_token')
    expect(authorized).toBeFalsy()
  })

  test('Should return authorized if JWT returns a authorized', async () => {
    const sut = makeSut()
    jwt.verify('any_token')
    const authorized = await sut.inspector('any_token')
    expect(authorized).toEqual(jwt.decoded)
  })

  test('Should call JWT with correct values', async () => {
    const sut = makeSut()
    await sut.inspector('any_token')
    expect(jwt.token).toBe('any_token')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no token is provided', async () => {
    const sut = makeSut()
    const promise = sut.inspector()
    expect(promise).rejects.toThrow(new MissingParamError('token'))
  })

  test('Should throw if no secret is provided', async () => {
    const sut = new TokenVerifier()
    const promise = sut.inspector('any_token')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
})
