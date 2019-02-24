import { sourcesTypes } from '../constants';
import helpers from '../../common/helpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  add: false,
  availableCredentials: [],
  edit: false,
  editSource: null,
  error: false,
  errorMessage: null,
  errorStatus: null,
  fulfilled: false,
  pending: false,
  show: false,
  source: {},
  stepOneValid: true,
  stepTwoValid: false,
  stepTwoErrorMessages: {}
};

const addSourceWizardReducer = (state = initialState, action) => {
  switch (action.type) {
    case sourcesTypes.CREATE_SOURCE_SHOW:
      return helpers.setStateProp(
        null,
        {
          add: true,
          show: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.EDIT_SOURCE_SHOW:
      return helpers.setStateProp(
        null,
        {
          edit: true,
          editSource: action.source,
          show: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.UPDATE_SOURCE_HIDE:
      return helpers.setStateProp(
        null,
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.VALID_SOURCE_WIZARD_STEPONE:
      return helpers.setStateProp(
        null,
        {
          source: action.source,
          stepOneValid: true
        },
        {
          state,
          reset: false
        }
      );

    case sourcesTypes.VALID_SOURCE_WIZARD_STEPTWO:
      return helpers.setStateProp(
        null,
        {
          source: { ...state.source, ...action.source },
          stepTwoValid: true
        },
        {
          state,
          reset: false
        }
      );

    case sourcesTypes.INVALID_SOURCE_WIZARD_STEPTWO:
      return helpers.setStateProp(
        null,
        {
          stepTwoValid: false
        },
        {
          state,
          reset: false
        }
      );

    case helpers.REJECTED_ACTION(sourcesTypes.UPDATE_SOURCE):
    case helpers.REJECTED_ACTION(sourcesTypes.ADD_SOURCE):
      const stepTwoRejectedErrors = helpers.getMessageFromResults(
        action.payload,
        [
          { map: 'credentials', value: apiTypes.API_SUBMIT_SOURCE_CREDENTIALS },
          { map: 'hosts', value: apiTypes.API_SUBMIT_SOURCE_HOSTS },
          { map: 'name', value: apiTypes.API_SUBMIT_SOURCE_NAME },
          { map: 'port', value: apiTypes.API_SUBMIT_SOURCE_PORT },
          { map: 'options', value: apiTypes.API_SUBMIT_SOURCE_OPTIONS }
        ],
        true
      );

      const message = Object.values(stepTwoRejectedErrors.messages)
        .filter(item => item !== '')
        .join(' ');

      return helpers.setStateProp(
        null,
        {
          error: action.error,
          errorMessage: message,
          errorStatus: helpers.getStatusFromResults(action.payload),
          stepTwoValid: message === '',
          stepTwoErrorMessages: stepTwoRejectedErrors.messages,
          pending: false
        },
        {
          state,
          reset: false
        }
      );

    case helpers.PENDING_ACTION(sourcesTypes.UPDATE_SOURCE):
    case helpers.PENDING_ACTION(sourcesTypes.ADD_SOURCE):
      return helpers.setStateProp(
        null,
        {
          error: false,
          errorMessage: null,
          pending: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.FULFILLED_ACTION(sourcesTypes.UPDATE_SOURCE):
    case helpers.FULFILLED_ACTION(sourcesTypes.ADD_SOURCE):
      return helpers.setStateProp(
        null,
        {
          error: false,
          errorMessage: null,
          fulfilled: true,
          pending: false,
          source: action.payload.data
        },
        {
          state,
          reset: false
        }
      );

    default:
      return state;
  }
};

addSourceWizardReducer.initialState = initialState;

export { addSourceWizardReducer as default, initialState, addSourceWizardReducer };
