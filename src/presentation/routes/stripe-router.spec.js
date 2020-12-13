const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')

class StripeRouter {
  constructor (stripeUseCase) {
    this.stripeUseCase = stripeUseCase
  }

  async route (httpRequest) {
    try {
      const { value, quantity, currency, orderId } = httpRequest.body
      if (!value) {
        return HttpResponse.badRequest(new MissingParamError('value'))
      }

      if (!quantity) {
        return HttpResponse.badRequest(new MissingParamError('quantity'))
      }

      if (!currency) {
        return HttpResponse.badRequest(new MissingParamError('currency'))
      }

      if (!orderId) {
        return HttpResponse.badRequest(new MissingParamError('orderId'))
      }

      await this.stripeUseCase.pay(value, quantity, currency, orderId)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeStripeUseCase = () => {
  class StripeUseCaseSpy {
    async pay (value, quantity, currency, orderId) {
      this.value = value
      this.quantity = quantity
      this.currency = currency
      this.orderId = orderId
      return this.sessionId
    }
  }

  return new StripeUseCaseSpy()
}

const makeSut = () => {
  const stripeUseCaseSpy = makeStripeUseCase()
  const sut = new StripeRouter(stripeUseCaseSpy)
  stripeUseCaseSpy.sessionId = 'valid_session_id'
  return {
    sut,
    stripeUseCaseSpy
  }
}

describe('Stripe Router', () => {
  test('Should return 400 if no value is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('value').message)
  })

  test('Should return 400 if no quantity is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        value: 'any_value',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('quantity').message)
  })

  test('Should return 400 if no currency is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('currency').message)
  })

  test('Should return 400 if no orderId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('orderId').message)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should call StripeUseCase with correct params', async () => {
    const { sut, stripeUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    await sut.route(httpRequest)
    expect(stripeUseCaseSpy.value).toBe(httpRequest.body.value)
    expect(stripeUseCaseSpy.quantity).toBe(httpRequest.body.quantity)
    expect(stripeUseCaseSpy.currency).toBe(httpRequest.body.currency)
    expect(stripeUseCaseSpy.orderId).toBe(httpRequest.body.orderId)
  })
})
