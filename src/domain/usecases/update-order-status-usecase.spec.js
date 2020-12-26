const { MissingParamError } = require('../../utils/errors')

class UpdateOrderStatusUseCase {
  async update (success, canceled, orderId) {
    if (!success) {
      throw new MissingParamError('success')
    }

    if (!canceled) {
      throw new MissingParamError('canceled')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
    }
  }
}

const makeSut = () => {
  const sut = new UpdateOrderStatusUseCase()
  return {
    sut
  }
}

describe('Update Order Status UseCase', () => {
  test('Should throw if no success param is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('success'))
  })
})
