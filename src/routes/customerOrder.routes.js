const express = require('express')
const routes = express.Router()

const CustomerOrderController = require('../controllers/http/api/CustomerOrderController')
const customerOrderController = new CustomerOrderController()

routes.post('/api/v1/customer-order/create-order', customerOrderController.createOrder)
routes.post('/api/v1/customer-order/update-order-status', customerOrderController.updateOrderStatus)
routes.get('/api/v1/customer-order/show-customer-orders/:customerId', customerOrderController.showCustomerOrders)
routes.get('/api/v1/customer-order/show-orders', customerOrderController.showOrders)

module.exports = routes
