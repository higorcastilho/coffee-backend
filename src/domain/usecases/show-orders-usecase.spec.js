const { MissingParamError } = require('../../utils/errors')

class ShowOrdersUseCase {
  async show (limit, offset) {
    if (!limit) {
      throw new MissingParamError('limit')
    }

    if (!offset) {
      throw new MissingParamError('offset')
    }
  }
}

const makeSut = () => {
  const sut = new ShowOrdersUseCase()
  return {
    sut
  }
}

describe('Show Orders Usecase', () => {
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
})
