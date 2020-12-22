const { adapt } = require('../adapters/express-router-adapter')
const ManageOrderComposer = require('../composers/manage-order-router-composer')

module.exports = router => {
  router.post('/manage-order', adapt(ManageOrderComposer.compose()))
}
