const { STRIPE_SECRET_KEY } = process.env
const stripe = require('stripe')(STRIPE_SECRET_KEY)
const MY_DOMAIN = 'http://localhost:3000/checkout'

class StripePaymentService {
  async createOrder (value, quantity, currency = 'brl', orderId) {
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${MY_DOMAIN}?success=true&order=${orderId}`,
      cancel_url: `${MY_DOMAIN}?canceled=true&order=${orderId}`
    })

    return session.id
  }
}

module.exports = StripePaymentService

// to activate, just pass the real secret_key and public_key
