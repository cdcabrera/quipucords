import * as types from '../constants/sourcesConstants';
import sourcesApi from '../../services/sourcesApi';

const getSourcesError = (bool, message) => ({
  type: types.GET_SOURCES_ERROR,
  error: bool,
  message: message
});

const getSourcesLoading = bool => ({
  type: types.GET_SOURCES_LOADING,
  loading: bool
});

const getSourcesSuccess = data => ({
  type: types.GET_SOURCES_SUCCESS,
  data
});

const getSources = () => {
  return function(dispatch) {
    dispatch(getSourcesLoading(true));
    return sourcesApi
      .getSources()
      .then(success => {
        dispatch(getSourcesSuccess(success));
      })
      .catch(error => {
        dispatch(getSourcesError(true, error.message));
      })
      .finally(() => dispatch(getSourcesLoading(false)));
  };
};

export { getSourcesError, getSourcesLoading, getSourcesSuccess, getSources };
