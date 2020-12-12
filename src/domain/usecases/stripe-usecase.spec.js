const MissingParamError = require('../../utils/errors/missing-param-error')

class StripeUseCase {
  async pay (value, quantity, orderId) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!quantity) {
      throw new MissingParamError('quantity')
    }
  }
}

const makeSut = () => {
  return new StripeUseCase()
}

describe('Stripe Usecase', () => {
  test('Should throw if no value is provided', async () => {
    const sut = makeSut()
    const promise = sut.pay()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })

  test('Should throw if no quantity is provided', async () => {
    const sut = makeSut()
    const promise = sut.pay('any_value')
    expect(promise).rejects.toThrow(new MissingParamError('quantity'))
  })
})
