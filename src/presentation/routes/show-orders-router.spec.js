const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

describe('Show Orders Router', () => {
  class ShowOrdersRouter {
    async route (httpRequest) {
      // const { limit, offset } = httpRequest.query

      return HttpResponse.badRequest(new MissingParamError('limit'))
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
})
