import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-errors'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name === undefined) {
      return badRequest(new MissingParamError('name'))
    }
    if (httpRequest.body.email === undefined) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
