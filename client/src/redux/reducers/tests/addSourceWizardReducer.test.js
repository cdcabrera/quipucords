import { sourcesTypes } from '../../constants/index';
import addSourceWizardReducer from '../addSourceWizardReducer';
import { sourcesMock } from '../../../../tests/mockFixtures';

const initialState = {
  view: {
    show: false,
    add: false,
    edit: false,
    allCredentials: [],
    source: {},
    error: false,
    errorMessage: null,
    stepOneValid: false,
    stepTwoValid: false,
    fulfilled: false
  }
};

describe('AddSourceWizardReducer', function() {
  it('should return the initial state', () => {
    expect(addSourceWizardReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle CREATE_SOURCE_SHOW', () => {
    let dispatched = {
      type: sourcesTypes.CREATE_SOURCE_SHOW
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(resultState.view.show).toBeTruthy();
    expect(resultState.view.add).toBeTruthy();
    expect(resultState.view.edit).toBeFalsy();

    dispatched = {
      type: sourcesTypes.UPDATE_SOURCE_HIDE
    };

    resultState = addSourceWizardReducer(resultState, dispatched);

    expect(resultState.view.show).toBeFalsy();
    expect(resultState.view).toEqual(initialState.view);
  });

  it('should handle EDIT_SOURCE_SHOW', () => {
    let dispatched = {
      type: sourcesTypes.EDIT_SOURCE_SHOW
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(resultState.view.show).toBeTruthy();
    expect(resultState.view.add).toBeFalsy();
    expect(resultState.view.edit).toBeTruthy();

    dispatched = {
      type: sourcesTypes.UPDATE_SOURCE_HIDE
    };

    resultState = addSourceWizardReducer(resultState, dispatched);

    expect(resultState.view.show).toBeFalsy();
    expect(resultState.view).toEqual(initialState.view);
  });

  it('should handle ADD_SOURCE_REJECTED', () => {
    let dispatched = {
      type: sourcesTypes.ADD_SOURCE_REJECTED,
      error: true,
      payload: {
        message: 'BACKUP MESSAGE',
        response: {
          request: {
            responseText: 'ADD ERROR'
          }
        }
      }
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(resultState.view.error).toBeTruthy();
    expect(resultState.view.errorMessage).toEqual('ADD ERROR');
    expect(resultState.view.add).toBeTruthy();
  });

  it('should handle UPDATE_SOURCE_REJECTED', () => {
    let dispatched = {
      type: sourcesTypes.UPDATE_SOURCE_REJECTED,
      error: true,
      payload: {
        message: 'BACKUP MESSAGE',
        response: {
          request: {
            responseText: 'UPDATE ERROR'
          }
        }
      }
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(resultState.view.error).toBeTruthy();
    expect(resultState.view.errorMessage).toEqual('UPDATE ERROR');
    expect(resultState.view.edit).toBeTruthy();
  });

  it('should handle UPDATE_SOURCE_FULFILLED', () => {
    let dispatched = {
      type: sourcesTypes.UPDATE_SOURCE_FULFILLED,
      payload: {
        data: { ...sourcesMock.putSourceResponse }
      }
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(Object.keys(resultState.view.source).length).toBeGreaterThan(0);
  });

  it('should handle ADD_SOURCE_FULFILLED', () => {
    let dispatched = {
      type: sourcesTypes.ADD_SOURCE_FULFILLED,
      payload: {
        data: { ...sourcesMock.postSourcesResponse }
      }
    };

    let resultState = addSourceWizardReducer(undefined, dispatched);

    expect(Object.keys(resultState.view.source).length).toBeGreaterThan(0);
  });
});
