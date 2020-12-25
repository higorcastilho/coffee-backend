const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

module.exports = class ShowOrdersRouter {
  constructor (showOrdersUseCase) {
    this.showOrdersUseCase = showOrdersUseCase
  }

  async route (httpRequest) {
    try {
      const { limit, offset } = httpRequest.query
      if (!limit) {
        return HttpResponse.badRequest(new MissingParamError('limit'))
      }

      if (!offset) {
        return HttpResponse.badRequest(new MissingParamError('offset'))
      }

      const orders = await this.showOrdersUseCase.show(limit, offset)

      return HttpResponse.ok({ orders })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
