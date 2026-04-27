const test = require('node:test');
const assert = require('node:assert/strict');
const { z } = require('zod');
const { validate } = require('../dist/middleware/validate');

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

test('validate middleware calls next and applies parsed data on valid body', () => {
  const schema = z.object({
    count: z.coerce.number().int().min(1),
    profile: z.object({ name: z.string().trim() }),
  });
  const middleware = validate(schema);
  const req = { body: { count: '2', profile: { name: '  ash  ' } } };
  const res = makeRes();
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, { count: 2, profile: { name: 'ash' } });
  assert.equal(res.out.statusCode, undefined);
});

test('validate middleware returns 400 with field-level errors on invalid body', () => {
  const schema = z.object({
    profile: z.object({
      email: z.string().email(),
    }),
  });
  const middleware = validate(schema);
  const req = { body: { profile: { email: 'invalid-email' } } };
  const res = makeRes();
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.out.statusCode, 400);
  assert.equal(res.out.body.error.message, 'Validation failed');
  assert.deepEqual(res.out.body.error.fields, [
    { field: 'profile.email', message: 'Invalid email address' },
  ]);
});
