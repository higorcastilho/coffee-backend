const MissingParamError = require('../../utils/errors/missing-param-error')

class StripeUseCase {
  async pay (value, quantity, currency, orderId) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!quantity) {
      throw new MissingParamError('quantity')
    }

    if (!currency) {
      throw new MissingParamError('currency')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
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

  test('Should throw if no currency is provided', async () => {
    const sut = makeSut()
    const promise = sut.pay('any_value', 'any_quantity')
    expect(promise).rejects.toThrow(new MissingParamError('currency'))
  })

  test('Should throw if no orderId is provided', async () => {
    const sut = makeSut()
    const promise = sut.pay('any_value', 'any_quantity', 'any_currency')
    expect(promise).rejects.toThrow(new MissingParamError('orderId'))
  })
})
