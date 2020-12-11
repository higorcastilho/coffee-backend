const jwt = require('jsonwebtoken')

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

  test('Should call JWT with correct values', async () => {
    const sut = makeSut()
    await sut.inspector('any_token')
    expect(jwt.token).toBe('any_token')
  })
})
