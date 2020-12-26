const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateOrderStatusRouter {
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
      // returns an empty object if updated successfully
      return HttpResponse.ok(response)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
