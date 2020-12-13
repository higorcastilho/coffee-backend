const StripeRouter = require('../../presentation/routes/stripe-router')
const StripeUseCase = require('../../domain/usecases/stripe-usecase')
const StripeService = require('../../domain/helpers/stripe-service')
const env = require('../config/env')

module.exports = class StripeRouterComposer {
  static compose () {
    const stripeService = new StripeService(env.frontendDomain, env.stripeSecretKey)
    const stripeUseCase = new StripeUseCase({ stripeService })
    return new StripeRouter(stripeUseCase)
  }
}
