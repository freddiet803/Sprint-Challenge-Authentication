const Users = require('../auth/auth-model.js');
const db = require('../database/dbConfig.js');
const request = require('supertest');
const server = require('../api/server.js');

describe('user_auth_router_model', () => {
  it('should be test environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  //   it('should add user to database', async () => {
  //     //await Users.addUser({ username: 'brittany', password: '123' });
  //     await db('users').insert({ username: 'brit', password: '123' });

  //     const users = await db('users');
  //     expect(users).toHaveLength(1);
  //   });

  it('should register/add user to database', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: '123' })
      .then(res => {
        expect(res.status).toBe(201);
      });
  });

  it('fails to register without all credentials', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'username only' })
      .then(res => {
        expect(res.status).toBe(400);
      });
  });

  it('logs a user in', async () => {
    await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123' })
      .then(res => {
        expect(res.status).toBe(200);
      });
  });

  it('should return a token to user after login', async () => {
    await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123' })
      .then(res => {
        expect(res.body.token).toBeDefined();
      });
  });

  afterAll(async () => {
    await db('users').truncate();
  });
});
