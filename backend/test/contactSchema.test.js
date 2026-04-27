const test = require('node:test');
const assert = require('node:assert/strict');
const { contactSchema } = require('../dist/middleware/validation/contactSchema');

test('contactSchema accepts valid payload and sanitizes HTML fields', () => {
  const result = contactSchema.parse({
    name: '  <Ashley> "Roy"  ',
    email: '  user@example.com  ',
    message: " Hello <b>world</b> & it's \"secure\" now. ",
  });

  assert.equal(result.name, '&lt;Ashley&gt; &quot;Roy&quot;');
  assert.equal(result.email, 'user@example.com');
  assert.equal(result.message, 'Hello &lt;b&gt;world&lt;/b&gt; &amp; it&#39;s &quot;secure&quot; now.');
});

test('contactSchema rejects invalid payload with field errors', () => {
  const parsed = contactSchema.safeParse({
    name: 'A',
    email: 'not-an-email',
    message: 'short',
  });

  assert.equal(parsed.success, false);
  if (parsed.success) return;

  const fields = parsed.error.issues.map((i) => i.path.join('.'));
  assert.deepEqual(fields.sort(), ['email', 'message', 'name']);
});
