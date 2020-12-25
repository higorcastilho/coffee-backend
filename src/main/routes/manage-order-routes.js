const { bodyAdapt, queryStringAdapt } = require('../adapters/express-router-adapter')
const ManageOrderComposer = require('../composers/manage-order-router-composer')
const ShowOrdersComposer = require('../composers/show-orders-router-composer')

module.exports = router => {
  router.post('/manage-order', bodyAdapt(ManageOrderComposer.compose()))
  router.get('/show-orders', queryStringAdapt(ShowOrdersComposer.compose()))
}
