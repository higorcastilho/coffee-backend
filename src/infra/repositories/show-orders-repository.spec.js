const { MissingParamError } = require('../../utils/errors')

class ShowOrdersRepository {
  async show (limit, offset) {
    throw new MissingParamError('limit')
  }
}

const makeSut = () => {
  const sut = new ShowOrdersRepository()
  return {
    sut
  }
}

describe('Show Orders Repository', () => {
  test('Should throw if no limit is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.show()
    expect(promise).rejects.toThrow(new MissingParamError('limit'))
  })
})
