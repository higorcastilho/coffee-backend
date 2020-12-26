const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class UpdateOrderStatusRouter {
  constructor (updateOrderStatusUseCase) {
    this.updateOrderStatusUseCase = updateOrderStatusUseCase
  }

  async route (httpRequest) {
    try {
      const { success, canceled, orderId } = httpRequest.body
      if (!success) {
        return HttpResponse.badRequest(new MissingParamError('success'))
      }

      if (!canceled) {
        return HttpResponse.badRequest(new MissingParamError('canceled'))
      }

      if (!orderId) {
        return HttpResponse.badRequest(new MissingParamError('orderId'))
      }

      const response = await this.updateOrderStatusUseCase.update(success, canceled, orderId)
      // returns a empty object if updated successfully
      return HttpResponse.ok(response)
    } catch (error) {
      return false
    }
  }
}

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

const makeSut = () => {
  const updateOrderStatusUseCaseSpy = makeUpdateOrderStatusUseCase()
  updateOrderStatusUseCaseSpy.response = {}
  const sut = new UpdateOrderStatusRouter(updateOrderStatusUseCaseSpy)
  return {
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
})
