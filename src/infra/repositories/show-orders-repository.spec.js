/* eslint-disable */
const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const ShowOrdersRepository = require('./show-orders-repository')

let ordersModel
let customerModel

const makeSut = () => {
  const sut = new ShowOrdersRepository()
  return {
    sut
  }
}

describe('Show Orders Repository', () => {

	beforeAll(async () => {	
		await MongoHelper.connect(process.env.MONGO_URL)
		ordersModel = await MongoHelper.getCollection('orders')
		customerModel = await MongoHelper.getCollection('users')	
	})

	beforeEach(async () => {
		await ordersModel.deleteMany()
		await customerModel.deleteMany()
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

  test('Should throw if no limit is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.show()
    expect(promise).rejects.toThrow(new MissingParamError('limit'))
  })

  test('Should throw if no offset is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.show('any_limit')
    expect(promise).rejects.toThrow(new MissingParamError('offset'))
  })

  test('Should return an empty array if no orders are found', async () => {
    const { sut } = makeSut()
    const limit = 10
    const offset = 1
    const orders = await sut.show(limit, offset)
    expect(orders).toEqual([])
  })

  test('Should orders if orders are found', async () => {
  	const { sut } = makeSut()
  	const limit = 10
  	const offset = 1
  	
  	const fakeCustomers = await customerModel.insertMany([
  		{
  			_id: 1,
  			name: 'João',
  			email: 'any_email',
  			phone: 'any_phone',
  			address: 'any_adress',
  			zip: 'any_zip'
  		},
  		{
  			_id: 2,
  			name: 'Maria',
  			email: 'any_email',
  			phone: 'any_phone',
  			address: 'any_adress',
  			zip: 'any_zip'
  		},
  		{
  			_id: 3,
  			name: 'Paulo',
  			email: 'any_email',
  			phone: 'any_phone',
  			address: 'any_adress',
  			zip: 'any_zip'
  		},
  		{
  			_id: 4,
  			name: 'Ana',
  			email: 'any_email',
  			phone: 'any_phone',
  			address: 'any_adress',
  			zip: 'any_zip'
  		},
  		{
  			_id: 5,
  			name: 'César',
  			email: 'any_email',
  			phone: 'any_phone',
  			address: 'any_adress',
  			zip: 'any_zip'
  		}
  	])

  	const fakeOrders = await ordersModel.insertMany([
  		{
  			_id: 1,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 1 
  		},
  		{
  			_id: 2,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 1 
  		},
  		{
  			_id: 3,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 2 
  		},
  		{
  			_id: 4,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 3 
  		},
  		{
  			_id: 5,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 4 
  		},
  		{
  			_id: 6,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 5 
  		},
  		{
  			_id: 7,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 5 
  		},
  		{
  			_id: 8,
  			paymentMethod: 'any_payment_method',
  			price: 'any_price',
  			quantity: 'any_quantity',
  			orderStatus: 'any_orderStatus',
  			customerId: 5 
  		}
  	])
  	
  	//offset cannot be less than 1
  	const orders = await sut.show(limit, offset)

    expect(orders[0]).toEqual({
      _id: fakeOrders.ops[0]._id,
      paymentMethod: fakeOrders.ops[0].paymentMethod,
      price: fakeOrders.ops[0].price,
      quantity: fakeOrders.ops[0].quantity,
      orderStatus: fakeOrders.ops[0].orderStatus,
      customerId: fakeOrders.ops[0].customerId,
      customer: [{
        _id: fakeCustomers.ops[0]._id,
        address: fakeCustomers.ops[0].address,
        email: fakeCustomers.ops[0].email,
        name: fakeCustomers.ops[0].name,
        phone: fakeCustomers.ops[0].phone,
        zip: fakeCustomers.ops[0].zip
      }] 
    })
  })
})

/* eslint-enable */
