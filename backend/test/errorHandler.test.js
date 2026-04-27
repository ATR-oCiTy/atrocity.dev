const test = require('node:test');
const assert = require('node:assert/strict');
const { errorHandler } = require('../dist/middleware/errorHandler');

const makeRes = () => {
  const out = { statusCode: undefined, body: undefined };
  return {
    out,
    status(code) {
      out.statusCode = code;
      return this;
    },
    json(payload) {
      out.body = payload;
      return this;
    },
  };
};

test('errorHandler masks 500 message in production', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const originalError = console.error;
  console.error = () => {};

  const req = { method: 'GET', path: '/profile' };
  const res = makeRes();
  const err = new Error('sensitive stack details');

  errorHandler(err, req, res, () => {});

  assert.equal(res.out.statusCode, 500);
  assert.deepEqual(res.out.body, {
    error: {
      message: 'Internal Server Error',
      status: 500,
      path: '/profile',
    },
  });

  console.error = originalError;
  process.env.NODE_ENV = originalNodeEnv;
});

test('errorHandler returns explicit status/message outside masked case', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  const originalError = console.error;
  console.error = () => {};

  const req = { method: 'POST', path: '/contact' };
  const res = makeRes();
  const err = new Error('Bad input');
  err.statusCode = 400;

  errorHandler(err, req, res, () => {});

  assert.equal(res.out.statusCode, 400);
  assert.deepEqual(res.out.body, {
    error: {
      message: 'Bad input',
      status: 400,
      path: '/contact',
    },
  });

  console.error = originalError;
  process.env.NODE_ENV = originalNodeEnv;
});
