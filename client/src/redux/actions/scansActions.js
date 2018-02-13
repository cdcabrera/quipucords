import { scansTypes } from '../constants';
import ScansService from '../../services/scansService';

const addScan = data => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.ADD_SCAN,
    payload: new ScansService(authToken).addScan(data)
  });
};

const cancelScan = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.CANCEL_SCAN,
    payload: new ScansService(authToken).cancelScan(id)
  });
};

const getScan = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.GET_SCAN,
    payload: new ScansService(authToken).getScan(id)
  });
};

const getScans = (query = {}) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.GET_SCANS,
    payload: new ScansService(authToken).getScans('', query)
  });
};

const getScanResults = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.GET_SCAN_RESULTS,
    payload: new ScansService(authToken).getScanResults(id)
  });
};

const pauseScan = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.PAUSE_SCAN,
    payload: new ScansService(authToken).pauseScan(id)
  });
};

const restartScan = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: scansTypes.RESTART_SCAN,
    payload: new ScansService(authToken).restartScan(id)
  });
};

export {
  addScan,
  cancelScan,
  getScan,
  getScans,
  getScanResults,
  pauseScan,
  restartScan
};
