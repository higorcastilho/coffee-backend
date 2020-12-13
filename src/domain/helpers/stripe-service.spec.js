const makePayload = (value, quantity, currency, orderId, frontendDomain) => {
  const payload = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://static.netshoes.com.br/produtos/whey-gourmet-expresso-700g-performance-nutrition/79/166-0107-479/166-0107-479_zoom1.jpg?ts=1594322077&']
          },
          unit_amount: value
        },
        quantity: quantity
      }
    ],
    mode: 'payment',
    success_url: `${frontendDomain}?success=true&order=${orderId}`,
    cancel_url: `${frontendDomain}?canceled=true&order=${orderId}`
  }

  return payload
}

jest.mock('stripe', () => ({
  checkout: {
    sessions: {
      payload: {},
      sessionId: { id: 'valid_id' },
      create: function (payload) {
        this.payload = payload
        return this.sessionId
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
    expect(stripe.checkout.sessions.payload).toEqual(makePayload('any_value', 'any_quantity', 'any_currency', 'any_orderId', 'frontend_domain'))
  })

  test('Should return null if stripe returns null', async () => {
    const sut = new StripeService('frontend_domain')
    stripe.checkout.sessions.sessionId = { id: null }
    const session = await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(session).toBeNull()
  })

  test('Should return a session id if stripe returns a session id', async () => {
    const sut = new StripeService('frontend_domain')
    const sessionId = await sut.createOrder('any_value', 'any_quantity', 'any_currency', 'any_orderId')
    expect(sessionId).toBe(stripe.checkout.sessions.sessionId.id)
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
