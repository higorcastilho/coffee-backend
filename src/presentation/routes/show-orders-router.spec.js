const HttpResponse = require('../helpers/http-response')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')

class ShowOrdersRouter {
  constructor (showOrdersUseCase) {
    this.showOrdersUseCase = showOrdersUseCase
  }

  async route (httpRequest) {
    try {
      const { limit, offset } = httpRequest.query
      if (!limit) {
        return HttpResponse.badRequest(new MissingParamError('limit'))
      }

      if (!offset) {
        return HttpResponse.badRequest(new MissingParamError('offset'))
      }

      await this.showOrdersUseCase.show(limit, offset)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeShowOrdersUseCase = () => {
  class ShowOrdersUseCaseSpy {
    async show (limit, offset) {
      this.limit = limit
      this.offset = offset
    }
  }

  return new ShowOrdersUseCaseSpy()
}

const makeSut = () => {
  const showOrdersUseCaseSpy = makeShowOrdersUseCase()
  const sut = new ShowOrdersRouter(showOrdersUseCaseSpy)
  return {
    showOrdersUseCaseSpy,
    sut
  }
}

describe('Show Orders Router', () => {
  test('Should return 400 if no limit is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      query: {
        offset: 'any_offset'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('limit').message)
  })

  test('Should return 400 if no offset is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      query: {
        limit: 'any_limit'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('offset').message)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Shoul call ShowOrdersUseCase with correct values', async () => {
    const { sut, showOrdersUseCaseSpy } = makeSut()
    const httpRequest = {
      query: {
        limit: 'any_limit',
        offset: 'any_offset'
      }
    }
    await sut.route(httpRequest)
    expect(showOrdersUseCaseSpy.limit).toBe(httpRequest.query.limit)
    expect(showOrdersUseCaseSpy.offset).toBe(httpRequest.query.offset)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const suts = [].concat(
      new ShowOrdersRouter(),
      new ShowOrdersRouter({})
    )

    for (const sut of suts) {
      const httpRequest = {
        query: {
          limit: 'any_limit',
          offset: 'any_offset'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
