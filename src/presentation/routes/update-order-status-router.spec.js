const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class UpdateOrderStatusRouter {
  async route (httpRequest) {
    try {
      const { success, canceled, orderId } = httpRequest.body
      console.log(success, canceled, orderId)
      return HttpResponse.badRequest(new MissingParamError('success'))
    } catch (error) {
      return false
    }
  }
}

const makeSut = () => {
  const sut = new UpdateOrderStatusRouter()
  return {
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
})
