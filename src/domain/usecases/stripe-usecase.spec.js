const MissingParamError = require('../../utils/errors/missing-param-error')

class StripeUseCase {
  constructor ({ stripeService } = {}) {
    this.stripeService = stripeService
  }

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

    const sessionId = await this.stripeService.createOrder(value, quantity, currency, orderId)
    return sessionId
  }
}

const makeStripeService = () => {
  class StripeServiceSpy {
    async createOrder (value, quantity, currency, orderId) {
      this.value = value
      this.quantity = quantity
      this.currency = currency
      this.orderId = orderId
      return this.sessionId
    }
  }

  const stripeServiceSpy = new StripeServiceSpy()
  stripeServiceSpy.sessionId = 'sessionId'
  return stripeServiceSpy
}

const makeSut = () => {
  const stripeServiceSpy = makeStripeService()
  const sut = new StripeUseCase({
    stripeService: stripeServiceSpy
  })

  return {
    sut,
    stripeServiceSpy
  }
}

describe('Stripe Usecase', () => {
  test('Should throw if no value is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.pay()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })

  test('Should throw if no quantity is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.pay('any_value')
    expect(promise).rejects.toThrow(new MissingParamError('quantity'))
  })

  test('Should throw if no currency is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.pay('any_value', 'any_quantity')
    expect(promise).rejects.toThrow(new MissingParamError('currency'))
  })

  test('Should throw if no orderId is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.pay('any_value', 'any_quantity', 'any_currency')
    expect(promise).rejects.toThrow(new MissingParamError('orderId'))
  })

  test('Should call StripeService with correct values', async () => {
    const { sut, stripeServiceSpy } = makeSut()
    await sut.pay('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(stripeServiceSpy.value).toBe('any_value')
    expect(stripeServiceSpy.quantity).toBe('any_quantity')
    expect(stripeServiceSpy.currency).toBe('any_currency')
    expect(stripeServiceSpy.orderId).toBe('any_orderId')
  })

  test('Should return a sessionId if correct values are provided', async () => {
    const { sut, stripeServiceSpy } = makeSut()
    const sessionId = await sut.pay('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(sessionId).toBe(stripeServiceSpy.sessionId)
    expect(sessionId).toBeTruthy()
  })
})
