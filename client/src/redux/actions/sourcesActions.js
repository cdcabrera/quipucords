import { sourcesTypes } from '../constants';
import SourcesService from '../../services/sourcesService';

const addSource = data => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.ADD_SOURCE,
    payload: new SourcesService(authToken).addSource(data)
  });
};

const deleteSource = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.DELETE_SOURCE,
    payload: new SourcesService(authToken).deleteSource(id)
  });
};

const deleteSources = (ids = []) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.DELETE_SOURCES,
    payload: new SourcesService(authToken).deleteSources(ids)
  });
};

const getSource = id => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.GET_SOURCE,
    payload: new SourcesService(authToken).getSource(id)
  });
};

const getSources = (query = {}) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.GET_SOURCES,
    payload: new SourcesService(authToken).getSources('', query)
  });
};

const updateSource = (id, data) => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: sourcesTypes.UPDATE_SOURCE,
    payload: new SourcesService(authToken).updateSource(id, data)
  });
};

export {
  addSource,
  deleteSource,
  deleteSources,
  getSource,
  getSources,
  updateSource
};
