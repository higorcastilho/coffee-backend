const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const UpdateOrderStatusRepository = require('./update-order-status-repository')

let orderModel, fakeOrderId

const makeSut = () => {
  const sut = new UpdateOrderStatusRepository()
  return {
    sut
  }
}

describe('Update Order Status Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    orderModel = await MongoHelper.getCollection('orders')
  })

  beforeEach(async () => {
    await orderModel.deleteMany()
    const fakeOrder = await orderModel.insertOne({
      paymentMethod: 'any_payment_method',
      price: 'any_price',
      quantity: 'any_quantity',
      orderStatus: 'any_orderStatus',
      createdAt: new Date(),
      customerId: 1
    })

    fakeOrderId = fakeOrder.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should throw if no orderStatus is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('orderStatus'))
  })

  test('Should throw if no orderId is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update('any_order_status')
    expect(promise).rejects.toThrow(new MissingParamError('orderId'))
  })

  test('Should return an empty object if order is correctly updated', async () => {
    const { sut } = makeSut()
    const response = await sut.update(10, fakeOrderId)
    const updatedFakeOrder = await orderModel.findOne({ _id: fakeOrderId })
    expect(response).toEqual({})
    expect(updatedFakeOrder.orderStatus).toBe(10)
  })
})
