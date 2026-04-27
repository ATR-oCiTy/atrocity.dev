const test = require('node:test');
const assert = require('node:assert/strict');

const nodemailer = require('nodemailer');
const { config } = require('../dist/config/env');
const { sendContactNotification } = require('../dist/services/emailService');

test('sendContactNotification skips when Gmail credentials are missing', async () => {
  const originalUser = config.gmailUser;
  const originalPass = config.gmailAppPassword;
  const originalCreateTransport = nodemailer.createTransport;
  const originalWarn = console.warn;

  const warnings = [];
  let transportCalled = false;

  config.gmailUser = '';
  config.gmailAppPassword = '';
  nodemailer.createTransport = () => {
    transportCalled = true;
    throw new Error('should not be called');
  };
  console.warn = (...args) => warnings.push(args.join(' '));

  await sendContactNotification({
    senderName: 'No Creds',
    senderEmail: 'nocreds@example.com',
    message: 'test',
  });

  assert.equal(transportCalled, false);
  assert.equal(warnings.some((line) => line.includes('skipping email notification')), true);

  config.gmailUser = originalUser;
  config.gmailAppPassword = originalPass;
  nodemailer.createTransport = originalCreateTransport;
  console.warn = originalWarn;
});

test('sendContactNotification sends formatted email when credentials exist', async () => {
  const originalUser = config.gmailUser;
  const originalPass = config.gmailAppPassword;
  const originalCreateTransport = nodemailer.createTransport;
  const originalLog = console.log;

  config.gmailUser = 'owner@example.com';
  config.gmailAppPassword = 'app-password';

  let transportConfig;
  let sentMailPayload;
  const logs = [];

  nodemailer.createTransport = (cfg) => {
    transportConfig = cfg;
    return {
      sendMail: async (mail) => {
        sentMailPayload = mail;
      },
    };
  };
  console.log = (...args) => logs.push(args.join(' '));

  await sendContactNotification({
    senderName: 'Ashley',
    senderEmail: 'ashley@example.com',
    message: 'hello from test',
  });

  assert.equal(transportConfig.service, 'gmail');
  assert.deepEqual(transportConfig.auth, {
    user: 'owner@example.com',
    pass: 'app-password',
  });
  assert.equal(sentMailPayload.to, 'owner@example.com');
  assert.equal(sentMailPayload.subject, '[Portfolio] New message from Ashley');
  assert.equal(sentMailPayload.replyTo, '"Ashley" <ashley@example.com>');
  assert.equal(String(sentMailPayload.text).includes('hello from test'), true);
  assert.equal(String(sentMailPayload.html).includes('ashley@example.com'), true);
  assert.equal(logs.some((line) => line.includes('Contact notification sent')), true);

  config.gmailUser = originalUser;
  config.gmailAppPassword = originalPass;
  nodemailer.createTransport = originalCreateTransport;
  console.log = originalLog;
});
