const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class StripeService {
  constructor (frontendDomain, stripeSecretKey) {
    this.frontendDomain = frontendDomain
    this.stripeSecretKey = stripeSecretKey
  }

  async createOrder (value, quantity, currency, orderId) {
    // try {
    if (!value || !quantity || !currency || !orderId || !this.frontendDomain || !this.stripeSecretKey) {
      throw new MissingParamError('createOrder param is missing')
    }

    const stripe = require('stripe')(this.stripeSecretKey)
    const payload = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
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
      success_url: `${this.frontendDomain}?success=true&order=${orderId}`,
      cancel_url: `${this.frontendDomain}?canceled=true&order=${orderId}`
    }

    const session = await stripe.checkout.sessions.create(payload)
    return session.id
    // } catch (e) {
    // console.log(e)
    // }
  }
}
