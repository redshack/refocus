/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/api/v1/token/createTokenByCredentials.js.js
 */

const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest(require('../../../../index').app);
const constants = require('../../../../api/v1/constants');
const u = require('./utils');
const registerPath = '/v1/register';
const tokenPath = '/v1/token/create_by_credentials';

describe('api: createToken', () => {
  const tokeName = 'test_token';
  before((done) => {
    api.post(registerPath)
    .send(u.fakeUserCredentials)
    .end((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  after(u.forceDelete);

  it('no user found', (done) => {
    api.post(tokenPath)
    .send({
      tokenName: tokeName,
      password: u.fakeUserCredentials.password,
      username: 'nouser',
    })
    .expect(constants.httpStatus.UNAUTHORIZED)
    .expect(/LoginError/)
    .end((err) => {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  it('Wrong password', (done) => {
    api.post(tokenPath)
    .send({
      tokenName: tokeName,
      password: 'wrongPasswd',
      username: u.fakeUserCredentials.username,
    })
    .expect(constants.httpStatus.UNAUTHORIZED)
    .expect(/LoginError/)
    .end((err) => {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  it('sucessful authentication, create token', (done) => {
    api.post(tokenPath)
    .send({
      tokenName: tokeName,
      password: u.fakeUserCredentials.password,
      username: u.fakeUserCredentials.username,
    })
    .expect(constants.httpStatus.CREATED)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      expect(res.body.name).to.be.equal(tokeName);
      expect(res.body.isDisabled).to.be.equal('0');
      expect(res.body.token).to.exist;

      done();
    });
  });
});

