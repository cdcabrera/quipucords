import { credentialsTypes } from '../constants';
import CredentialsService from '../../services/credentialsService';

const addCredential = data => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.ADD_CREDENTIAL,
    payload: new CredentialsService(authToken).addCredential(data)
  });
};

const getCredential = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.GET_CREDENTIAL,
    payload: new CredentialsService(authToken).getCredential(id)
  });
};

const getCredentials = (query = {}) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.GET_CREDENTIALS,
    payload: new CredentialsService(authToken).getCredentials('', query)
  });
};

const updateCredential = (id, data) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.UPDATE_CREDENTIAL,
    payload: new CredentialsService(authToken).updateCredential(id, data)
  });
};

const deleteCredential = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.DELETE_CREDENTIAL,
    payload: new CredentialsService(authToken).deleteCredential(id)
  });
};

const deleteCredentials = (ids = []) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: credentialsTypes.DELETE_CREDENTIALS,
    payload: new CredentialsService(authToken).deleteCredential(ids)
  });
};

export {
  addCredential,
  deleteCredential,
  deleteCredentials,
  getCredential,
  getCredentials,
  updateCredential
};
