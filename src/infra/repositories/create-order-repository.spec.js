const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const CreateOrderRepository = require('./create-order-repository')

let orderModel

const makeSut = () => {
  const sut = new CreateOrderRepository()

  return {
    sut
  }
}

describe('Create Order Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    orderModel = await MongoHelper.getCollection('orders')
  })

  beforeEach(async () => {
    await orderModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should throw if no paymentMethod is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create()
    expect(promise).rejects.toThrow(new MissingParamError('payment method'))
  })

  test('Should throw if no price is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method')
    expect(promise).rejects.toThrow(new MissingParamError('price'))
  })

  test('Should throw if no quantity is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price')
    expect(promise).rejects.toThrow(new MissingParamError('quantity'))
  })

  test('Should throw if no orderStatus is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price', 'any_quantity')
    expect(promise).rejects.toThrow(new MissingParamError('order status'))
  })

  test('Should throw if no customer id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_payment_method', 'any_price', 'any_quantity', 'any_order_status')
    expect(promise).rejects.toThrow(new MissingParamError('customer id'))
  })

  test('Should return a order if a order is successfully created', async () => {
    const { sut } = makeSut()
    const order = await sut.create('any_payment_method', 'any_price', 'any_quantity', 'any_order_status', 'any_customer_id')
    expect(order).toEqual({
      _id: order._id,
      paymentMethod: 'any_payment_method',
      price: 'any_price',
      quantity: 'any_quantity',
      orderStatus: 'any_order_status',
      customerId: 'any_customer_id'
    })
  })
})
