const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

let orderModel

class UpdateOrderStatusRepository {
  async update (orderStatus, orderId) {
    if (!orderStatus) {
      throw new MissingParamError('orderStatus')
    }
  }
}

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
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should throw if no orderStatus is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('orderStatus'))
  })
})
