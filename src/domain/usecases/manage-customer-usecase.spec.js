const { MissingParamError } = require('../../utils/errors')
const ManageCustomerUsecase = require('./manage-customer-usecase')

const makeCreateUserRepository = () => {
  class CreateUserRepositorySpy {
    async create (name, email, phone, address, zip) {
      this.name = name
      this.email = email
      this.phone = phone
      this.address = address
      this.zip = zip
      return this.user
    }
  }

  return new CreateUserRepositorySpy()
}

const makeCreateUserRepositoryWithError = () => {
  class CreateUserRepositorySpy {
    async create () {
      throw new Error()
    }
  }

  return new CreateUserRepositorySpy()
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const createUserRepositorySpy = makeCreateUserRepository()
  const sut = new ManageCustomerUsecase(loadUserByEmailRepositorySpy, createUserRepositorySpy)
  return {
    loadUserByEmailRepositorySpy,
    createUserRepositorySpy,
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

  test('Should return a customer if valid e-mail is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = 'valid_user'
    const customerId = await sut.returnOrCreateCustomer('any_name', 'valid_email', 'any_phone', 'any_address', 'any_zip')
    expect(customerId).toBe('valid_user')
    expect(customerId).toBeTruthy()
  })

  test('Should call CreateUserRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    await sut.returnOrCreateCustomer('any_name', 'not_registered_email', 'any_phone', 'any_address', 'any_zip')
    expect(createUserRepositorySpy.name).toBe('any_name')
    expect(createUserRepositorySpy.email).toBe('not_registered_email')
    expect(createUserRepositorySpy.phone).toBe('any_phone')
    expect(createUserRepositorySpy.address).toBe('any_address')
    expect(createUserRepositorySpy.zip).toBe('any_zip')
  })

  test('Should create and return a customer if not registered e-mail is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    createUserRepositorySpy.user = 'valid_user'
    const customerId = await sut.returnOrCreateCustomer('any_name', 'not_registered_email', 'any_phone', 'any_address', 'any_zip')
    expect(customerId).toBe('valid_user')
    expect(customerId).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const suts = [].concat(
      new ManageCustomerUsecase(null, null),
      new ManageCustomerUsecase({}, null),
      new ManageCustomerUsecase(loadUserByEmailRepositorySpy, null),
      new ManageCustomerUsecase(loadUserByEmailRepositorySpy, {})
    )

    for (const sut of suts) {
      const promise = sut.returnOrCreateCustomer('any_name', 'valid_email', 'any_phone', 'any_address', 'any_zip')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const suts = [].concat(
      new ManageCustomerUsecase(makeLoadUserByEmailRepositoryWithError()),
      new ManageCustomerUsecase(loadUserByEmailRepositorySpy, makeCreateUserRepositoryWithError)
    )

    for (const sut of suts) {
      const promise = sut.returnOrCreateCustomer('any_name', 'valid_email', 'any_phone', 'any_address', 'any_zip')
      expect(promise).rejects.toThrow()
    }
  })
})
