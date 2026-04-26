import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { submitContact } from '../src/controllers/contactController';
import { ContactRepository } from '../src/repositories/contactRepository';
import * as emailService from '../src/services/emailService';

describe('ContactController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonSpy;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    // Arrange: Setup mock request and response objects
    req = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Test message for contact'
      }
    };
    
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    
    res = {
      status: statusStub
    };
    
    next = sinon.spy();
  });

  afterEach(() => {
    // Cleanup stubs after each test
    sinon.restore();
  });

  it('should successfully submit contact and return 201', async () => {
    // Arrange
    const createStub = sinon.stub(ContactRepository, 'create').resolves();
    const sendEmailStub = sinon.stub(emailService, 'sendContactNotification').resolves();

    // Act
    await submitContact(req as Request, res as Response, next);

    // Assert
    expect(createStub.calledOnceWithExactly({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Test message for contact'
    })).to.be.true;
    
    expect(sendEmailStub.calledOnce).to.be.true;
    expect(statusStub.calledOnceWithExactly(201)).to.be.true;
    expect(jsonStub.calledOnceWithExactly({ message: 'Contact submitted successfully' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should call next(error) if database creation fails', async () => {
    // Arrange
    const dbError = new Error('Database connection failed');
    sinon.stub(ContactRepository, 'create').rejects(dbError);
    const sendEmailStub = sinon.stub(emailService, 'sendContactNotification').resolves();

    // Act
    await submitContact(req as Request, res as Response, next);

    // Assert
    expect(sendEmailStub.notCalled).to.be.true; // Email should not be sent if DB fails
    expect(next.calledOnceWithExactly(dbError)).to.be.true;
    expect(statusStub.notCalled).to.be.true;
  });

  it('should still return 201 even if email notification fails (non-blocking)', async () => {
    // Arrange
    sinon.stub(ContactRepository, 'create').resolves();
    const emailError = new Error('SMTP connection timeout');
    sinon.stub(emailService, 'sendContactNotification').rejects(emailError);

    // Act
    await submitContact(req as Request, res as Response, next);

    // Assert
    expect(statusStub.calledOnceWithExactly(201)).to.be.true;
    expect(jsonStub.calledOnceWithExactly({ message: 'Contact submitted successfully' })).to.be.true;
    expect(next.notCalled).to.be.true; // Error handler should not be called
  });
});
