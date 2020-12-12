const StripePaymentService = require('../../../services/payment/Stripe')

class StripeOrdersController {
  async pay (req, res) {
    const { value, quantity, orderId } = req.body

    const formattedValue = value * 100
    const stripePaymentService = new StripePaymentService()
    const sessionId = await stripePaymentService.createOrder(formattedValue, quantity, 'brl', orderId)

    res.json({ id: sessionId })
  }
}
module.exports = StripeOrdersController
