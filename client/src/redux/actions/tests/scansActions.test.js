import expect from 'expect';
import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { scansActions } from '../';
import { scansReducer } from '../../reducers';
import { scansMock } from '../../../../tests/mockFixtures';

describe('ScansActions', function() {
  const middleware = [promiseMiddleware()];
  const generateStore = () => createStore(combineReducers({ scans: scansReducer }), applyMiddleware(...middleware));

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Update the scans view state when getScans is complete', done => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          ...scansMock.getScans
        }
      });
    });

    const store = generateStore();
    expect(store.scans).toEqual(scansReducer.initialState);

    const dispatcher = scansActions.getScans();

    dispatcher(store.dispatch).then(() => {
      const view = store.getState().scans.view;

      expect(view.scans).toEqual(scansMock.getScans.results);
      expect(view.fulfilled).toBeTruthy();
      expect(view.pending).toBeFalsy();
      expect(view.error).toBeFalsy();
      expect(view.errorMessage).toEqual('');

      done();
    });
  });
});
