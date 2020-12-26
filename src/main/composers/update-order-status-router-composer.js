const UpdateOrderStatusRouter = require('../../presentation/routes/update-order-status-router')
const UpdateOrderStatusUseCase = require('../../domain/usecases/update-order-status-usecase')
const UpdateOrderStatusRepository = require('../../infra/repositories/update-order-status-repository')

module.exports = class UpdateOrderStatusRouterComposer {
  static compose () {
    const updateOrderStatusRepository = new UpdateOrderStatusRepository()
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(updateOrderStatusRepository)
    return new UpdateOrderStatusRouter(updateOrderStatusUseCase)
  }
}
