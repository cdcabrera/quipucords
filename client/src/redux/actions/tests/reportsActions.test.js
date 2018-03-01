import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reportsActions } from '../';
import { reportsReducer } from '../../reducers';

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

  const getReportsMock = {
    results: {
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
    },
    headers: { 'content-type': 'application/json' }
  };

  it('Update the report state with systems that have been scanned', () => {});
});
