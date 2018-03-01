import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { sourcesActions } from '../';
import { sourcesReducer } from '../../reducers';

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

  const getSourcesMock = {
    results: {
      count: 0,
      next: 'string',
      previous: 'string',
      results: [
        {
          name: 'string',
          source_type: 'network',
          hosts: ['string'],
          port: 0,
          id: 0,
          credentials: [
            {
              id: 0,
              name: 'string',
              cred_type: 'network'
            }
          ],
          options: {
            satellite_version: '5',
            ssl_cert_verify: true,
            ssl_protocol: 'SSLv2',
            disable_ssl: true
          },
          connection: {
            id: 0,
            start_time: '2018-03-01T16:52:10.740Z',
            end_time: '2018-03-01T16:52:10.740Z',
            status: 'created',
            systems_count: 0,
            systems_scanned: 0,
            systems_failed: 0
          }
        }
      ]
    },
    headers: { 'content-type': 'application/json' }
  };

  it('Update the sources state with sources available for scanning', () => {});
});
