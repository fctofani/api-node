import request from 'supertest'
import app from '../config/app'

describe('SignUp routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Fabricio',
        email: 'fbc@mail.com',
        password: '123',
        confirmPassword: '123'
      })
      .expect(200)
  })
})
