const express = require('express')
const routes = express.Router()

const StripeOrdersController = require('../controllers/http/api/StripeOrdersController')
const stripeOrdersController = new StripeOrdersController()

routes.post('/api/v1/stripe/create-session', stripeOrdersController.pay)

module.exports = routes
