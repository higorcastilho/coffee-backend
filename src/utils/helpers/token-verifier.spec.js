jest.mock('jsonwebtoken', () => ({
  decoded: true,
  verify (token) {
    return this.decoded
  }
}))

class TokenVerifier {
  async verify (token) {
    return false
  }
}

// const jwt = require('jsonwebtoken')

describe('Token Verifier', () => {
  test('Should return false if JWT returns false', async () => {
    const sut = new TokenVerifier()
    const decoded = await sut.verify('any_token')
    expect(decoded).toBeFalsy()
  })
})
