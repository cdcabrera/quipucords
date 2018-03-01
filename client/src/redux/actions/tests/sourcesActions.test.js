import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { sourcesActions } from '../';
import { sourcesReducer } from '../../reducers';
import { sourcesMock } from '../../../../tests/mockFixtures';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(combineReducers({ reports: sourcesReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Update the sources state with sources available for scanning', () => {});
});
