jest.mock('stripe', () => ({
  checkout: {
    sessions: {
      value: 'any_value',
      quantity: 'any_quantity',
      currency: 'any_currency',
      orderId: 'any_orderId',
      frontendDomain: 'any_domain',
      create: function (value, quantity, currency, orderId, frontendDomain) {
        this.value = value
        this.quantity = quantity
        this.currency = currency
        this.orderId = orderId
        this.frontendDomain = frontendDomain
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
    await stripe.checkout.sessions.create(value, quantity, currency, orderId, this.frontendDomain)
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
})
