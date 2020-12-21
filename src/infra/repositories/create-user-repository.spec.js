const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

let userModel

class CreateUserRepository {
  async create (name, email, phone, address, zip) {
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
  }
}

const makeSut = () => {
  const sut = new CreateUserRepository()
  return {
    sut
  }
}

describe('Create User Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should throw if no name is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create()
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_name')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no phone is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_name', 'unregistered_email')
    expect(promise).rejects.toThrow(new MissingParamError('phone'))
  })

  test('Should throw if no address is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_name', 'unregistered_email', 'any_phone')
    expect(promise).rejects.toThrow(new MissingParamError('address'))
  })

  test('Should throw if no zip is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.create('any_name', 'unregistered_email', 'any_phone', 'any_address')
    expect(promise).rejects.toThrow(new MissingParamError('zip'))
  })
})
