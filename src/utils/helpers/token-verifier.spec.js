const jwt = require('jsonwebtoken')

jest.mock('jsonwebtoken', () => ({
  secret: 'secret',
  decoded: {},
  verify (token, secret) {
    this.secret = secret
    return this.decoded
  }
}))

class TokenVerifier {
  async inspector (token) {
    const authorized = jwt.verify(token, 'secret')
    return authorized
  }
}

const makeSut = () => {
  return new TokenVerifier()
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
    jwt.verify('any_token', 'secret')
    const authorized = await sut.inspector('any_token')
    expect(authorized).toEqual(jwt.decoded)
  })
})
