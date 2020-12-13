const { adapt } = require('../adapters/express-router-adapter')
const StripeRouterComposer = require('../composers/stripe-router-composer')

module.exports = router => {
  router.post('/create-customer-order/stripe', adapt(StripeRouterComposer.compose()))
}
