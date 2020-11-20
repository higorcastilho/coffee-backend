const StripePaymentService = require('../../../services/payment/Stripe')

class StripeOrdersController {
  async pay (req, res) {
    const stripePaymentService = new StripePaymentService()
    const sessionId = await stripePaymentService.createOrder(2000, 2, 'brl')

    res.json({ id: sessionId })
  }
}

module.exports = StripeOrdersController
