const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')
const ManageOrderRouter = require('./manage-order-router')

const makeManageCustomerUseCase = () => {
  class ManageCustomerUseCaseSpy {
    async returnOrCreateCustomer (name, email, phone, address, zip) {
      this.name = name
      this.email = email
      this.phone = phone
      this.address = address
      this.zip = zip
      return this.customerId
    }
  }

  return new ManageCustomerUseCaseSpy()
}

const makeManageCustomerUseCaseWithError = () => {
  class ManageCustomerUseCaseSpy {
    async returnOrCreateCustomer () {
      throw new Error()
    }
  }

  return new ManageCustomerUseCaseSpy()
}

const makeManageOrderInfoUseCase = () => {
  class ManageOrderInfoUseCaseSpy {
    async createOrder (paymentMethod, price, quantity, orderStatus, customerId = null) {
      this.paymentMethod = paymentMethod
      this.price = price
      this.quantity = quantity
      this.orderStatus = orderStatus
      this.customerId = customerId
      return this.orderId
    }
  }

  return new ManageOrderInfoUseCaseSpy()
}

const makeManageOrderInfoUseCaseWithError = () => {
  class ManageOrderInfoUseCaseSpy {
    async createOrder () {
      throw new Error()
    }
  }

  return new ManageOrderInfoUseCaseSpy()
}

const makeSut = () => {
  const manageCustomerUseCaseSpy = makeManageCustomerUseCase()
  manageCustomerUseCaseSpy.customerId = 'valid_customerId'
  const manageOrderInfoUseCaseSpy = makeManageOrderInfoUseCase()
  manageOrderInfoUseCaseSpy.orderId = 'valid_orderId'
  const sut = new ManageOrderRouter(manageCustomerUseCaseSpy, manageOrderInfoUseCaseSpy)
  return {
    sut,
    manageCustomerUseCaseSpy,
    manageOrderInfoUseCaseSpy
  }
}

// variables and methods for the first test
const name = 'any_name'
const email = 'any_email'
const phone = 'any_phone'
const address = 'any_adress'
const zip = 'any_zip'
const paymentMethod = 'any_paymentMethod'
const price = 'any_price'
const quantity = 'any_quantity'
const orderStatus = 'any_orderStatus'

const params = [name, email, phone, address, zip, paymentMethod, price, quantity, orderStatus]

const changeHttpRquest = (array, position) => {
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
      const httpRequest = { body: changeHttpRquest([...params], i) }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('order info param (e.g.: name, address, quantity ...)').message)
    })
  }

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const response = await sut.route(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body.error).toBe(new ServerError().message)
  })

  test('Should call ManageCustomerUseCase and ManageOrderInfoUseCase with correct params', async () => {
    const { sut, manageCustomerUseCaseSpy, manageOrderInfoUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone',
        address: 'any_adress',
        zip: 'any_zip',
        paymentMethod: 'any_paymentMethod',
        price: 'any_price',
        quantity: 'any_quantity',
        orderStatus: 'any_orderStatus'
      }
    }
    await sut.route(httpRequest)
    expect(manageCustomerUseCaseSpy.name).toBe(httpRequest.body.name)
    expect(manageCustomerUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(manageCustomerUseCaseSpy.phone).toBe(httpRequest.body.phone)
    expect(manageCustomerUseCaseSpy.address).toBe(httpRequest.body.address)
    expect(manageCustomerUseCaseSpy.zip).toBe(httpRequest.body.zip)
    expect(manageOrderInfoUseCaseSpy.paymentMethod).toBe(httpRequest.body.paymentMethod)
    expect(manageOrderInfoUseCaseSpy.price).toBe(httpRequest.body.price)
    expect(manageOrderInfoUseCaseSpy.quantity).toBe(httpRequest.body.quantity)
    expect(manageOrderInfoUseCaseSpy.orderStatus).toBe(httpRequest.body.orderStatus)
  })

  test('Should return 200 if valid params are provided', async () => {
    const { sut, manageOrderInfoUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone',
        address: 'any_adress',
        zip: 'any_zip',
        paymentMethod: 'any_paymentMethod',
        price: 'any_price',
        quantity: 'any_quantity',
        orderStatus: 'any_orderStatus'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.orderId).toBe(manageOrderInfoUseCaseSpy.orderId)
    expect(httpResponse.body.orderId).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const suts = [].concat(
      new ManageOrderRouter(),
      new ManageOrderRouter({}),
      new ManageOrderRouter(makeManageCustomerUseCase),
      new ManageOrderRouter(makeManageCustomerUseCase, {})
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone',
          address: 'any_adress',
          zip: 'any_zip',
          paymentMethod: 'any_paymentMethod',
          price: 'any_price',
          quantity: 'any_quantity',
          orderStatus: 'any_orderStatus'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should throw if any dependency throws', async () => {
    const suts = [].concat(
      new ManageOrderRouter(makeManageCustomerUseCaseWithError()),
      new ManageOrderRouter(makeManageCustomerUseCase(), makeManageOrderInfoUseCaseWithError())
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone',
          address: 'any_adress',
          zip: 'any_zip',
          paymentMethod: 'any_paymentMethod',
          price: 'any_price',
          quantity: 'any_quantity',
          orderStatus: 'any_orderStatus'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
