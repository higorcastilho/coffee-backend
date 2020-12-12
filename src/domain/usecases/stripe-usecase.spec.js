const MissingParamError = require('../../utils/errors/missing-param-error')

class StripeUseCase {
  async pay (value, quantity, orderId) {
    throw new MissingParamError('value')
  }
}

describe('Stripe Usecase', () => {
  test('Should throw if no value is provided', async () => {
    const sut = new StripeUseCase()
    const promise = sut.pay()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })
})
