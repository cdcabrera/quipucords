import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { credentialsActions } from '../';
import { credentialsReducer } from '../../reducers';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(combineReducers({ credentials: credentialsReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const getCredentialsMock = {
    results: {
      count: 0,
      next: 'string',
      previous: 'string',
      results: [
        {
          name: 'string',
          cred_type: 'network',
          username: 'string',
          password: 'string',
          ssh_keyfile: 'string',
          become_method: 'sudo',
          become_user: 'string',
          become_password: 'string',
          sources: [
            {
              id: 0,
              name: 'string',
              source_type: 'network'
            }
          ],
          id: 0
        }
      ]
    },
    headers: { 'content-type': 'application/json' }
  };

  it('Updates the credentials view state when getCredentials is complete', () => {});
});
