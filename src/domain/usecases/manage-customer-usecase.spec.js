const { MissingParamError } = require('../../utils/errors')

class ManageCustomerUsecase {
  async returnOrCreateCustomer (name, email, phone, address, zip) {
    if (!name) {
      throw new MissingParamError('name')
    }

    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Manage Customer Usecase ', () => {
  test('Should throw if no name is provided', async () => {
    const sut = new ManageCustomerUsecase()
    const promise = sut.returnOrCreateCustomer()
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })

  test('Should throw if no email is provided', async () => {
    const sut = new ManageCustomerUsecase()
    const promise = sut.returnOrCreateCustomer('any_name')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
