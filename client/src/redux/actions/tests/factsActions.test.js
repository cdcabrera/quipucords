import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { factsActions } from '../';
import { factsReducer } from '../../reducers';

describe('CredentialsActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () => createStore(combineReducers({ facts: factsReducer() }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const postFactsMock = {
    body: {
      sources: [
        {
          source_id: 12,
          source_type: 'network',
          facts: [
            {
              etc_release_name: 'Red Hat Enterprise Linux Server',
              etc_release_release: 'Red Hat Enterprise Linux Server release 6.7 (Santiago)',
              etc_release_version: '6.7',
              connection_uuid: 'abc7f26f-1234-57bd-85d8-de7617123456'
            }
          ]
        }
      ]
    },
    results: {},
    headers: { 'content-type': 'application/json' }
  };

  it('Submits facts from environment scans to be stored', () => {});
});
