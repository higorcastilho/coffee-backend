const ManageOrderRouter = require('../../presentation/routes/manage-order-router')
const ManageCustomerUseCase = require('../../domain/usecases/manage-customer-usecase')
const ManageOrderInfoUseCase = require('../../domain/usecases/manage-orderInfo-usecase')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const CreateUserRepository = require('../../infra/repositories/create-user-repository')
const CreateOrderRepository = require('../../infra/repositories/create-order-repository')

module.exports = class ManageOrderComposer {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const createUserRepository = new CreateUserRepository()
    const createOrderRepository = new CreateOrderRepository()

    const manageCustomerUseCase = new ManageCustomerUseCase(loadUserByEmailRepository, createUserRepository)
    const manageOrderInfoUseCase = new ManageOrderInfoUseCase(createOrderRepository)

    return new ManageOrderRouter(
      manageCustomerUseCase,
      manageOrderInfoUseCase
    )
  }
}
