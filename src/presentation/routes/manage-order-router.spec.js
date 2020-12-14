const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class ManageOrderRouter {
  async route (httpRequest) {
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
  }
}

const makeSut = () => {
  const sut = new ManageOrderRouter()
  return {
    sut
  }
}

// variables and methods for the first test
const name = 'any_name'
const email = 'any_email'
const phone = 'any_phone'
const address = 'any_adress'
const zip = 'any_zip'
const paymentMethod = 'any_paymentMethod'
const orderNumber = 'any_orderNumber'
const price = 'any_price'
const quantity = 'any_quantity'
const orderStatus = 'any_orderStatus'

const params = [name, email, phone, address, zip, paymentMethod, orderNumber, price, quantity, orderStatus]

const makeVariableHttpRquest = (array, position) => {
  array.splice(position, 1)
  const body = {}
  array.forEach(item => {
    body[item.slice(4, item.length)] = item
  })

  return body
}

describe('Manage Order Router', () => {
  for (let i = 0; i < params.length; i++) {
    test('Should return 400 if any of the params is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest = { body: makeVariableHttpRquest([...params], i) }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('order info param (e.g.: name, address, quantity ...)').message)
    })
  }
})
