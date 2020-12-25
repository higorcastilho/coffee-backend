const { MissingParamError } = require('../../utils/errors')

class ShowOrdersUseCase {
  constructor (showOrdersRepository) {
    this.showOrdersRepository = showOrdersRepository
  }

  async show (limit, offset) {
    if (!limit) {
      throw new MissingParamError('limit')
    }

    if (!offset) {
      throw new MissingParamError('offset')
    }

    await this.showOrdersRepository.show(limit, offset)
  }
}

const makeShowOrdersRepository = () => {
  class ShowOrdersRepositorySpy {
    async show (limit, offset) {
      this.limit = limit
      this.offset = offset
    }
  }

  return new ShowOrdersRepositorySpy()
}

const makeShowOrdersRepositoryWithError = () => {
  class ShowOrdersRepositorySpy {
    async show () {
      throw new Error()
    }
  }

  return new ShowOrdersRepositorySpy()
}

const makeSut = () => {
  const showOrdersRepositorySpy = makeShowOrdersRepository()
  const sut = new ShowOrdersUseCase(showOrdersRepositorySpy)
  return {
    showOrdersRepositorySpy,
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

  test('Should call ShowOrdersRepositorySpy', async () => {
    const { sut, showOrdersRepositorySpy } = makeSut()
    await sut.show('any_limit', 'any_offset')
    expect(showOrdersRepositorySpy.limit).toBe('any_limit')
    expect(showOrdersRepositorySpy.offset).toBe('any_offset')
  })

  test('Should throw if invalid dependecies are provided', async () => {
    const suts = [].concat(
      new ShowOrdersUseCase(),
      new ShowOrdersUseCase({})
    )

    for (const sut of suts) {
      const promise = sut.show('any_limit', 'any_offset')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const showOrdersRepositoryWithError = makeShowOrdersRepositoryWithError()
    const suts = [].concat(
      new ShowOrdersUseCase(showOrdersRepositoryWithError)
    )

    for (const sut of suts) {
      const promise = sut.show('any_limit', 'any_offset')
      expect(promise).rejects.toThrow()
    }
  })
})
