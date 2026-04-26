import { describe, it } from 'mocha';
import { expect } from 'chai';
import { contactSchema } from '../src/middleware/validation/contactSchema';

describe('ContactSchema Validation Unit Tests', () => {
  it('should accept valid contact form data', () => {
    // Arrange
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I would like to contact you about a job.'
    };

    // Act
    const result = contactSchema.safeParse(validData);

    // Assert
    expect(result.success).to.be.true;
    if (result.success) {
      expect(result.data.name).to.equal('John Doe');
      expect(result.data.email).to.equal('john@example.com');
    }
  });

  it('should sanitize HTML tags from name and message (XSS Prevention)', () => {
    // Arrange
    const maliciousData = {
      name: '<script>alert("xss")</script>',
      email: 'hacker@example.com',
      message: 'Hello <img src="x" onerror="alert(1)">'
    };

    // Act
    const result = contactSchema.safeParse(maliciousData);

    // Assert
    expect(result.success).to.be.true;
    if (result.success) {
      expect(result.data.name).to.equal('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(result.data.message).to.equal('Hello &lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
    }
  });

  it('should reject invalid email addresses', () => {
    // Arrange
    const invalidEmailData = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is a valid message length.'
    };

    // Act
    const result = contactSchema.safeParse(invalidEmailData);

    // Assert
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.equal('Invalid email address');
    }
  });

  it('should reject messages shorter than 10 characters', () => {
    // Arrange
    const shortMessageData = {
      name: 'John',
      email: 'john@example.com',
      message: 'Hi'
    };

    // Act
    const result = contactSchema.safeParse(shortMessageData);

    // Assert
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.equal('Message must be at least 10 characters');
    }
  });
});
