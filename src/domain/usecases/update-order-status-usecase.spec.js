const { MissingParamError } = require('../../utils/errors')
const UpdateOrderStatusUseCase = require('./update-order-status-usecase')

const makeUpdateOrderStatusRepository = () => {
  class UpdateOrderStatusRepositorySpy {
    async update (orderStatus, orderId) {
      this.orderStatus = orderStatus
      this.orderId = orderId
      return this.response
    }
  }

  return new UpdateOrderStatusRepositorySpy()
}

const makeUpdateOrderStatusRepositoryWithError = () => {
  class UpdateOrderStatusRepositorySpy {
    async update () {
      throw new Error()
    }
  }

  return new UpdateOrderStatusRepositorySpy()
}

const makeSut = () => {
  const updateOrderStatusRepositorySpy = makeUpdateOrderStatusRepository()
  updateOrderStatusRepositorySpy.response = {}
  const sut = new UpdateOrderStatusUseCase(updateOrderStatusRepositorySpy)
  return {
    updateOrderStatusRepositorySpy,
    sut
  }
}

describe('Update Order Status UseCase', () => {
  test('Should throw if no success param is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('success'))
  })

  test('Should throw if no canceled param is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update('any_boolean')
    expect(promise).rejects.toThrow(new MissingParamError('canceled'))
  })

  test('Should throw if no orderId param is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update('any_boolean', '!any_boolean')
    expect(promise).rejects.toThrow(new MissingParamError('orderId'))
  })

  test('Should call UpdateOrderStatusRepository with correct values', async () => {
    const { sut, updateOrderStatusRepositorySpy } = makeSut()
    await sut.update('any_boolean', '!any_boolean', 'any_order_id')
    expect(updateOrderStatusRepositorySpy.orderStatus).toBe(sut.orderStatus)
    expect(updateOrderStatusRepositorySpy.orderId).toBe('any_order_id')
  })

  test('Should return an empty object if correct values are provided and is updated successfully', async () => {
    const { sut } = makeSut()
    const response = await sut.update('any_boolean', '!any_boolean', 'any_order_id')
    expect(response).toEqual({})
  })

  test('Should throw if invalid dependecies are provided', async () => {
    const suts = [].concat(
      new UpdateOrderStatusUseCase(),
      new UpdateOrderStatusUseCase({})
    )

    for (const sut of suts) {
      const promise = sut.update('any_boolean', '!any_boolean', 'any_order_id')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const updateOrderStatusRepositorySpyWithError = makeUpdateOrderStatusRepositoryWithError()
    const suts = [].concat(
      new UpdateOrderStatusUseCase(updateOrderStatusRepositorySpyWithError)
    )

    for (const sut of suts) {
      const promise = sut.update('any_boolean', '!any_boolean', 'any_order_id')
      expect(promise).rejects.toThrow()
    }
  })
})
