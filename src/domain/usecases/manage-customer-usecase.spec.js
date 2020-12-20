const { MissingParamError } = require('../../utils/errors')

class ManageCustomerUsecase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async returnOrCreateCustomer (name, email, phone, address, zip) {
    if (!name) {
      throw new MissingParamError('name')
    }

    if (!email) {
      throw new MissingParamError('email')
    }

    if (!phone) {
      throw new MissingParamError('phone')
    }

    if (!address) {
      throw new MissingParamError('address')
    }

    if (!zip) {
      throw new MissingParamError('zip')
    }

    this.loadUserByEmailRepository.load('any_email')
  }
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new ManageCustomerUsecase(loadUserByEmailRepositorySpy)
  return {
    loadUserByEmailRepositorySpy,
    sut
  }
}

describe('Manage Customer Usecase ', () => {
  test('Should throw if no name is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.returnOrCreateCustomer()
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.returnOrCreateCustomer('any_name')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no phone is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.returnOrCreateCustomer('any_name', 'any_email')
    expect(promise).rejects.toThrow(new MissingParamError('phone'))
  })

  test('Should throw if no address is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.returnOrCreateCustomer('any_name', 'any_email', 'any_phone')
    expect(promise).rejects.toThrow(new MissingParamError('address'))
  })

  test('Should throw if no zip is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.returnOrCreateCustomer('any_name', 'any_email', 'any_phone', 'any_address')
    expect(promise).rejects.toThrow(new MissingParamError('zip'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.returnOrCreateCustomer('any_name', 'any_email', 'any_phone', 'any_address', 'any_zip')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email')
  })
})
