const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

describe('Show Orders Router', () => {
  class ShowOrdersRouter {
    async route (httpRequest) {
      const { limit, offset } = httpRequest.query
      if (!limit) {
        return HttpResponse.badRequest(new MissingParamError('limit'))
      }

      if (!offset) {
        return HttpResponse.badRequest(new MissingParamError('offset'))
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
})
