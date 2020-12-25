const ShowOrdersRouter = require('../../presentation/routes/show-orders-router')
const ShowOrdersUseCase = require('../../domain/usecases/show-orders-usecase')
const ShowOrdersRepository = require('../../infra/repositories/show-orders-repository')

module.exports = class ShowOrdersComposer {
  static compose () {
    const showOrdersRepository = new ShowOrdersRepository()
    const showOrdersUseCase = new ShowOrdersUseCase(showOrdersRepository)

    return new ShowOrdersRouter(showOrdersUseCase)
  }
}
