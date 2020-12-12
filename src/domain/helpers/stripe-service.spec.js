jest.mock('stripe', () => ({
  checkout: {
    sessions: {
      value: '',
      quantity: '',
      currency: '',
      orderId: '',
      frontendDomain: '',
      session: 'valid_session',
      create: function (value, quantity, currency, orderId, frontendDomain) {
        this.value = value
        this.quantity = quantity
        this.currency = currency
        this.orderId = orderId
        this.frontendDomain = frontendDomain
        return this.session
      }
    }
  }
}))

const MissingParamError = require('../../utils/errors/missing-param-error')
const stripe = require('stripe')
const StripeService = require('./stripe-service')

describe('Stripe Service Dependecy', () => {
  test('Should call stripe with correct values', async () => {
    const sut = new StripeService('frontend_domain')
    await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(stripe.checkout.sessions.frontendDomain).toBe('frontend_domain')
    expect(stripe.checkout.sessions.value).toBe('any_value')
    expect(stripe.checkout.sessions.quantity).toBe('any_quantity')
    expect(stripe.checkout.sessions.currency).toBe('any_currency')
    expect(stripe.checkout.sessions.orderId).toBe('any_orderId')
  })

  test('Should return null if stripe returns null', async () => {
    const sut = new StripeService('frontend_domain')
    stripe.checkout.sessions.session = null
    const session = await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(session).toBeNull()
  })

  test('Should return a session if stripe returns a session', async () => {
    const sut = new StripeService('frontend_domain')
    const session = await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(session).toBe(stripe.checkout.sessions.session)
  })

  test('Should throw if no frontendDomain is provided', async () => {
    const sut = new StripeService()
    const promise = sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(promise).rejects.toThrow(new MissingParamError('createOrder param is missing'))
  })

  test('Should throw if any of the params is not provided', async () => {
    const stripeService = new StripeService('frontend_domain')
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
