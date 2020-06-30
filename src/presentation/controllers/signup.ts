import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-errors'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name === undefined) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (httpRequest.body.email === undefined) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
