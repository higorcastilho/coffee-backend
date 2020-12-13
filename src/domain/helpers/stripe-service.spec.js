const MissingParamError = require('../../utils/errors/missing-param-error')
const stripe = require('stripe')('STRIPE_SECRET_KEY')
const StripeService = require('./stripe-service')

jest.mock('stripe', () => jest.fn(() => ({
  checkout: {
    sessions: {
      sessionId: { id: 'valid_id' },
      currency: '',
      amount: '',
      quantity: '',
      domain: '',
      orderId: '',
      create (payload) {
        this.currency = payload.line_items[0].price_data.currency
        this.amount = payload.line_items[0].price_data.unit_amount
        this.quantity = payload.line_items[0].quantity
        this.domain = payload.success_url.slice(0, 19)
        this.orderId = payload.success_url.slice(39, 51)
        return this.sessionId
      }
    }
  }
})))

const makeSut = () => {
  const sut = new StripeService('any_frontend_domain', 'stripe_secret_key')
  return sut
}

describe('Stripe Service Dependecy', () => {
  /* test('Should call stripe with correct values', async () => {
    const sut = makeSut()
    sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(stripe.checkout.sessions.currency).toBe('any_currency')
  }) */

  test('Should return a session id if stripe returns a session id', async () => {
    const sut = makeSut()
    const session = await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(session).toBe(stripe.checkout.sessions.sessionId.id)
  })

  test('Should throw if no frontendDomain is provided', async () => {
    const sut = new StripeService()
    const promise = sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(promise).rejects.toThrow(new MissingParamError('createOrder param is missing'))
  })

  test('Should throw if no stripeSecretKey is provided', async () => {
    const sut = new StripeService('frontend_domain')
    const promise = sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(promise).rejects.toThrow(new MissingParamError('createOrder param is missing'))
  })

  test('Should throw if any of the params is not provided', async () => {
    const stripeService = makeSut()
    const suts = [].concat(
      stripeService.createOrder(),
      stripeService.createOrder('any_value'),
      stripeService.createOrder('any_value', 'any_quantity'),
      stripeService.createOrder('any_value', 'any_quantity', 'any_currency')
    )

    for (const sut of suts) {
      const promise = sut
      expect(promise).rejects.toThrow(new MissingParamError('createOrder param is missing'))
    }
  })
})
