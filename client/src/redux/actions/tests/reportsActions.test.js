import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reportsActions } from '../';
import { reportsReducer } from '../../reducers';
import { reportsMock } from '../../../../tests/mockFixtures';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(combineReducers({ reports: reportsReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Update the report state with systems that have been scanned', () => {});
});
