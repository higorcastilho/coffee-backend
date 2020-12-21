const { MissingParamError } = require('../../utils/errors')

class ManageOrderInfoUseCase {
  constructor (createOrderRepository) {
    this.createOrderRepository = createOrderRepository
  }

  async createOrder (paymentMethod, price, quantity, orderStatus, customerId) {
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

    const order = await this.createOrderRepository.create(paymentMethod, price, quantity, orderStatus, customerId)
    return order
  }
}

const makeCreateOrderRepositoryWithError = () => {
  class CreateOrderRepositorySpy {
    async create () {
      throw new Error()
    }
  }

  return new CreateOrderRepositorySpy()
}

const makeSut = () => {
  const sut = new ManageOrderInfoUseCase()
  return {
    sut
  }
}

describe('Order Info Usecase', () => {
  test('Shoul throw if no paymentMethod is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.createOrder()
    expect(promise).rejects.toThrow(new MissingParamError('payment method'))
  })

  test('Shoul throw if no price is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.createOrder('any_payment_method')
    expect(promise).rejects.toThrow(new MissingParamError('price'))
  })

  test('Shoul throw if no quantity is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.createOrder('any_payment_method', 'any_price')
    expect(promise).rejects.toThrow(new MissingParamError('quantity'))
  })

  test('Shoul throw if no orderStatus is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.createOrder('any_payment_method', 'any_price', 'any_quantity')
    expect(promise).rejects.toThrow(new MissingParamError('order status'))
  })

  test('Shoul throw if no customer id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.createOrder('any_payment_method', 'any_price', 'any_quantity', 'any_order_status')
    expect(promise).rejects.toThrow(new MissingParamError('customer id'))
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const suts = [].concat(
      new ManageOrderInfoUseCase(null),
      new ManageOrderInfoUseCase({})
    )

    for (const sut of suts) {
      const promise = sut.createOrder('any_payment_method', 'any_price', 'any_quantity', 'any_order_status', 'any_customer_id')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const createOrderRepositorySpyWithError = makeCreateOrderRepositoryWithError()
    const sut = new ManageOrderInfoUseCase(createOrderRepositorySpyWithError)
    const promise = sut.createOrder('any_payment_method', 'any_price', 'any_quantity', 'any_order_status', 'any_customer_id')
    expect(promise).rejects.toThrow()
  })
})
