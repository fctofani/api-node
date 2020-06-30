import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-errors'

const sutFactory = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = sutFactory()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const sut = sutFactory()
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
    const sut = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        confirm_password: 'any_confirm_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const sut = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password-confirmation'))
  })
})
