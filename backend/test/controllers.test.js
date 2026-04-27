const test = require('node:test');
const assert = require('node:assert/strict');

const { getSkills } = require('../dist/controllers/skillsController');
const { getExperiences } = require('../dist/controllers/experienceController');
const { getEducation } = require('../dist/controllers/educationController');
const { getClients } = require('../dist/controllers/clientsController');
const { getProfile } = require('../dist/controllers/profileController');
const { submitContact } = require('../dist/controllers/contactController');

const { SkillRepository } = require('../dist/repositories/skillRepository');
const { ExperienceRepository } = require('../dist/repositories/experienceRepository');
const { EducationRepository } = require('../dist/repositories/educationRepository');
const { ClientRepository } = require('../dist/repositories/clientRepository');
const { ProfileRepository } = require('../dist/repositories/profileRepository');
const { ContactRepository } = require('../dist/repositories/contactRepository');
const emailService = require('../dist/services/emailService');

const makeRes = () => {
  const out = { statusCode: undefined, jsonBody: undefined };
  return {
    out,
    status(code) {
      out.statusCode = code;
      return this;
    },
    json(payload) {
      out.jsonBody = payload;
      return this;
    },
  };
};

async function runRepoControllerSuccessAndError({
  controller,
  repository,
  methodName,
  data,
  repositoryLabel,
}) {
  const original = repository[methodName];

  const resSuccess = makeRes();
  let nextSuccessCalled = false;
  repository[methodName] = async () => data;
  await controller({}, resSuccess, () => {
    nextSuccessCalled = true;
  });
  assert.equal(nextSuccessCalled, false, `${repositoryLabel}: next should not be called on success`);
  assert.deepEqual(resSuccess.out.jsonBody, data, `${repositoryLabel}: expected JSON payload`);

  const expectedError = new Error(`${repositoryLabel} failed`);
  const resError = makeRes();
  let nextErrorArg;
  repository[methodName] = async () => {
    throw expectedError;
  };
  await controller({}, resError, (err) => {
    nextErrorArg = err;
  });
  assert.equal(nextErrorArg, expectedError, `${repositoryLabel}: expected error passed to next`);

  repository[methodName] = original;
}

test('collection controllers handle repository success and error paths', async () => {
  await runRepoControllerSuccessAndError({
    controller: getSkills,
    repository: SkillRepository,
    methodName: 'findAll',
    data: [{ name: 'TypeScript' }],
    repositoryLabel: 'SkillRepository',
  });

  await runRepoControllerSuccessAndError({
    controller: getExperiences,
    repository: ExperienceRepository,
    methodName: 'findAll',
    data: [{ company: 'Acme' }],
    repositoryLabel: 'ExperienceRepository',
  });

  await runRepoControllerSuccessAndError({
    controller: getEducation,
    repository: EducationRepository,
    methodName: 'findAll',
    data: [{ school: 'Cyber U' }],
    repositoryLabel: 'EducationRepository',
  });

  await runRepoControllerSuccessAndError({
    controller: getClients,
    repository: ClientRepository,
    methodName: 'findAll',
    data: [{ name: 'Client X' }],
    repositoryLabel: 'ClientRepository',
  });
});

test('getProfile returns JSON when profile exists', async () => {
  const originalFindOne = ProfileRepository.findOne;
  ProfileRepository.findOne = async () => ({ name: 'Ashley' });

  const res = makeRes();
  let nextArg;
  await getProfile({}, res, (err) => {
    nextArg = err;
  });

  assert.equal(nextArg, undefined);
  assert.deepEqual(res.out.jsonBody, { name: 'Ashley' });

  ProfileRepository.findOne = originalFindOne;
});

test('getProfile forwards 404 AppError when profile does not exist', async () => {
  const originalFindOne = ProfileRepository.findOne;
  ProfileRepository.findOne = async () => null;

  const res = makeRes();
  let nextArg;
  await getProfile({}, res, (err) => {
    nextArg = err;
  });

  assert.equal(nextArg instanceof Error, true);
  assert.equal(nextArg.message, 'Profile not found');
  assert.equal(nextArg.statusCode, 404);

  ProfileRepository.findOne = originalFindOne;
});

test('getProfile forwards repository error', async () => {
  const originalFindOne = ProfileRepository.findOne;
  const expected = new Error('db down');
  ProfileRepository.findOne = async () => {
    throw expected;
  };

  const res = makeRes();
  let nextArg;
  await getProfile({}, res, (err) => {
    nextArg = err;
  });

  assert.equal(nextArg, expected);
  ProfileRepository.findOne = originalFindOne;
});

test('submitContact persists contact, sends notification, and returns 201', async () => {
  const originalCreate = ContactRepository.create;
  const originalSend = emailService.sendContactNotification;

  const createdPayloads = [];
  const sentPayloads = [];

  ContactRepository.create = async (payload) => {
    createdPayloads.push(payload);
  };
  emailService.sendContactNotification = async (payload) => {
    sentPayloads.push(payload);
  };

  const req = { body: { name: 'Test User', email: 'test.user@example.com', message: 'This is a successful contact submission test message.' } };
  const res = makeRes();
  let nextArg;
  await submitContact(req, res, (err) => {
    nextArg = err;
  });

  assert.equal(nextArg, undefined);
  assert.deepEqual(createdPayloads, [req.body]);
  assert.deepEqual(sentPayloads, [
    {
      senderName: 'Test User',
      senderEmail: 'test.user@example.com',
      message: 'This is a successful contact submission test message.',
    },
  ]);
  assert.equal(res.out.statusCode, 201);
  assert.deepEqual(res.out.jsonBody, { message: 'Contact submitted successfully' });

  ContactRepository.create = originalCreate;
  emailService.sendContactNotification = originalSend;
});

test('submitContact reports DB errors via next', async () => {
  const originalCreate = ContactRepository.create;
  const originalSend = emailService.sendContactNotification;
  const expected = new Error('insert failed');

  ContactRepository.create = async () => {
    throw expected;
  };
  let sendCalled = false;
  emailService.sendContactNotification = async () => {
    sendCalled = true;
  };

  const req = { body: { name: 'DB Failure User', email: 'db.failure@example.com', message: 'This message validates database failure handling.' } };
  const res = makeRes();
  let nextArg;
  await submitContact(req, res, (err) => {
    nextArg = err;
  });

  assert.equal(nextArg, expected);
  assert.equal(sendCalled, false);

  ContactRepository.create = originalCreate;
  emailService.sendContactNotification = originalSend;
});

test('submitContact keeps success response even when notification promise rejects', async () => {
  const originalCreate = ContactRepository.create;
  const originalSend = emailService.sendContactNotification;
  const originalConsoleError = console.error;
  const logged = [];

  ContactRepository.create = async () => {};
  emailService.sendContactNotification = async () => {
    throw new Error('smtp down');
  };
  console.error = (...args) => {
    logged.push(args.join(' '));
  };

  const req = { body: { name: 'Notification Failure User', email: 'notify.failure@example.com', message: 'This message validates notification failure fallback behavior.' } };
  const res = makeRes();
  let nextArg;
  await submitContact(req, res, (err) => {
    nextArg = err;
  });
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(nextArg, undefined);
  assert.equal(res.out.statusCode, 201);
  assert.equal(logged.some((entry) => entry.includes('Email notification failed')), true);

  ContactRepository.create = originalCreate;
  emailService.sendContactNotification = originalSend;
  console.error = originalConsoleError;
});
