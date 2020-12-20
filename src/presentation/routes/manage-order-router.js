const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')
module.exports = class ManageOrderRouter {
  constructor (manageCustomerUseCase, manageOrderInfoUseCase) {
    this.manageCustomerUseCase = manageCustomerUseCase
    this.manageOrderInfoUseCase = manageOrderInfoUseCase
  }

  async route (httpRequest) {
    try {
      const {
        name,
        email,
        phone,
        address,
        zip,
        paymentMethod,
        orderNumber,
        price,
        quantity,
        orderStatus
      } = httpRequest.body

      if (!name || !email || !phone || !address || !zip || !paymentMethod || !orderNumber || !price || !quantity || !orderStatus) {
        return HttpResponse.badRequest(new MissingParamError('order info param (e.g.: name, address, quantity ...)'))
      }

      const customerId = await this.manageCustomerUseCase.returnOrCreateCustomer(name, email, phone, address, zip)
      if (!customerId) {
        return HttpResponse.serverError()
      }
      const orderId = await this.manageOrderInfoUseCase.createOrder(paymentMethod, orderNumber, price, quantity, orderStatus, customerId)

      if (!orderId) {
        return HttpResponse.serverError()
      }
      return HttpResponse.ok({ orderId })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
