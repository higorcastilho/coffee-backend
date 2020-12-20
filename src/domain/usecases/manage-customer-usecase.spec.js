const { MissingParamError } = require('../../utils/errors')

class ManageCustomerUsecase {
  async returnOrCreateCustomer () {
    throw new MissingParamError('name')
  }
}

describe('Manage Customer Usecase ', () => {
  test('Should throw if no name is provided', async () => {
    const sut = new ManageCustomerUsecase()
    const promise = sut.returnOrCreateCustomer()
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })
})
