const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

class CreateOrderRepository {
  async create (paymentMethod, price, quantity, orderStatus, customerId) {
    if (!paymentMethod) {
      throw new MissingParamError('payment method')
    }

    if (!price) {
      throw new MissingParamError('price')
    }

    if (!quantity) {
      throw new MissingParamError('quantity')
    }

    if (!orderStatus) {
      throw new MissingParamError('order status')
    }

    if (!customerId) {
      throw new MissingParamError('customer id')
    }

    const order = await MongoHelper.getCollection('orders')
    console.log(order)
  }
}

const makeSut = () => {
  const sut = new CreateOrderRepository()

  return {
    sut
  }
}

describe('Create Order Repository', () => {
  test('Shoul throw if no paymentMethod is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create()
    expect(promise).rejects.toThrow(new MissingParamError('payment method'))
  })

  test('Shoul throw if no price is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method')
    expect(promise).rejects.toThrow(new MissingParamError('price'))
  })

  test('Shoul throw if no quantity is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price')
    expect(promise).rejects.toThrow(new MissingParamError('quantity'))
  })

  test('Shoul throw if no orderStatus is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price', 'any_quantity')
    expect(promise).rejects.toThrow(new MissingParamError('order status'))
  })

  test('Shoul throw if no customer id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price', 'any_quantity', 'any_order_status')
    expect(promise).rejects.toThrow(new MissingParamError('customer id'))
  })
})
