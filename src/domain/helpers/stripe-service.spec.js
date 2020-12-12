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

const stripe = require('stripe')

class StripeService {
  constructor (frontendDomain) {
    this.frontendDomain = frontendDomain
  }

  async createOrder (value, quantity, currency, orderId) {
    // const formattedValue = value * 100
    const session = await stripe.checkout.sessions.create(value, quantity, currency, orderId, this.frontendDomain)
    return session
  }
}

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
})
