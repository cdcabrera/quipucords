import * as types from '../constants/reportsConstants';
import reportsApi from '../../services/reportsApi';

const getReportsError = (bool, message) => ({
  type: types.GET_REPORTS_ERROR,
  error: bool,
  message: message
});

const getReportsLoading = bool => ({
  type: types.GET_REPORTS_LOADING,
  loading: bool
});

const getReportsSuccess = data => ({
  type: types.GET_REPORTS_SUCCESS,
  data
});

const getReports = () => {
  return function(dispatch) {
    dispatch(getReportsLoading(true));
    return reportsApi
      .getReports()
      .then(success => {
        dispatch(getReportsSuccess(success));
      })
      .catch(error => {
        dispatch(getReportsError(true, error.message));
      })
      .finally(() => dispatch(getReportsLoading(false)));
  };
};

export { getReportsError, getReportsLoading, getReportsSuccess, getReports };
