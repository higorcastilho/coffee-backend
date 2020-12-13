const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')
const StripeRouter = require('./stripe-router')
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

const makeStripeUseCaseWithError = () => {
  class StripeUseCaseSpy {
    async pay () {
      throw new Error()
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

  test('Should return 200 if valid values are provided', async () => {
    const { sut, stripeUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.sessionId).toBe(stripeUseCaseSpy.sessionId)
  })

  test('Should return 500 if no StripeUseCase is provided', async () => {
    const sut = new StripeRouter()
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should throw if an invalid dependency is provided', async () => {
    const stripeUseCaseSpy = {}
    const sut = new StripeRouter(stripeUseCaseSpy)
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should throw if any dependency throws', async () => {
    const stripeUseCaseSpy = makeStripeUseCaseWithError()
    const sut = new StripeRouter(stripeUseCaseSpy)
    const httpRequest = {
      body: {
        value: 'any_value',
        quantity: 'any_quantity',
        currency: 'any_currency',
        orderId: 'any_orderId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
})
