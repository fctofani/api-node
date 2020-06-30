import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
}

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const emailValidatorWithErrorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const sutFactory = (): SutTypes => {
  const emailValidator = emailValidatorFactory()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    emailValidator
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirm_password'))
  })

  test('should return 400 if invalid email is provided', () => {
    const { sut, emailValidator } = sutFactory()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidator } = sutFactory()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', () => {
    const emailValidator = emailValidatorWithErrorFactory()
    const sut = new SignUpController(emailValidator)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
