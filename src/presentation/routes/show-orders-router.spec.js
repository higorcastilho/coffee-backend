const HttpResponse = require('../helpers/http-response')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')

describe('Show Orders Router', () => {
  class ShowOrdersRouter {
    async route (httpRequest) {
      try {
        const { limit, offset } = httpRequest.query
        if (!limit) {
          return HttpResponse.badRequest(new MissingParamError('limit'))
        }

        if (!offset) {
          return HttpResponse.badRequest(new MissingParamError('offset'))
        }
      } catch (error) {
        return HttpResponse.serverError()
      }
    }
  }

  const makeSut = () => {
    const sut = new ShowOrdersRouter()
    return {
      sut
    }
  }

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
})
