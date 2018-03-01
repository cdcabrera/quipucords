import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { userActions } from '../';
import { userReducer } from '../../reducers';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () => createStore(combineReducers({ reports: userReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const getUserMock = {
    results: {
      username: 'string'
    },
    headers: { 'content-type': 'application/json' }
  };

  it('Update the user state with a username of the current user', () => {});
});
