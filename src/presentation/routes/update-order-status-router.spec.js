const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')
const UpdateOrderStatusRouter = require('./update-order-status-router')

const makeUpdateOrderStatusUseCase = () => {
  class UpdateOrderStatusUseCaseSpy {
    async update (success, canceled, orderId) {
      this.success = success
      this.canceled = canceled
      this.orderId = orderId
      return this.response
    }
  }

  return new UpdateOrderStatusUseCaseSpy()
}

const makeUpdateOrderStatusUseCaseWithError = () => {
  class UpdateOrderStatusUseCaseSpyWithError {
    async update () {
      throw new Error()
    }
  }

  return new UpdateOrderStatusUseCaseSpyWithError()
}

const makeSut = () => {
  const updateOrderStatusUseCaseSpyWithError = makeUpdateOrderStatusUseCaseWithError
  const updateOrderStatusUseCaseSpy = makeUpdateOrderStatusUseCase()
  updateOrderStatusUseCaseSpy.response = {}
  const sut = new UpdateOrderStatusRouter(updateOrderStatusUseCaseSpy)
  return {
    updateOrderStatusUseCaseSpyWithError,
    updateOrderStatusUseCaseSpy,
    sut
  }
}

describe('Update Order Status Router', () => {
  test('Should return 400 if no success param is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('success').message)
  })

  test('Should return 400 if no canceled param is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        success: 'any_boolean'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('canceled').message)
  })

  test('Should return 400 if no orderId param is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        success: 'any_boolean',
        canceled: '!any_boolean'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('orderId').message)
  })

  test('Should call UpdateOrderStatusUseCase with correct values', async () => {
    const { sut, updateOrderStatusUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        success: 'any_boolean',
        canceled: '!any_boolean',
        orderId: 'any_order_id'
      }
    }
    await sut.route(httpRequest)
    expect(updateOrderStatusUseCaseSpy.success).toBe(httpRequest.body.success)
    expect(updateOrderStatusUseCaseSpy.canceled).toBe(httpRequest.body.canceled)
    expect(updateOrderStatusUseCaseSpy.orderId).toBe(httpRequest.body.orderId)
  })

  test('Should return 200 if correct values are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        success: 'any_boolean',
        canceled: '!any_boolean',
        orderId: 'any_order_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({})
  })

  test('Should return 500 if invalid dependecies are provided', async () => {
    const suts = [].concat(
      new UpdateOrderStatusRouter(),
      new UpdateOrderStatusRouter({})
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          success: 'any_boolean',
          canceled: '!any_boolean',
          orderId: 'any_order_id'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependecy throws', async () => {
    const updateOrderStatusUseCaseSpyWithError = makeUpdateOrderStatusUseCaseWithError()
    const suts = [].concat(
      new UpdateOrderStatusRouter(updateOrderStatusUseCaseSpyWithError)
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          success: 'any_boolean',
          canceled: '!any_boolean',
          orderId: 'any_order_id'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
