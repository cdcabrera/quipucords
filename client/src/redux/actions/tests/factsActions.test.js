import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { factsActions } from '../';
import { factsReducer } from '../../reducers';
import { factsMock } from '../../../../tests/mockFixtures';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () => createStore(combineReducers({ facts: factsReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Submits facts from environment scans to be stored', () => {});
});
