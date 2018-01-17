import * as types from '../constants/scansConstants';
import scansApi from '../../services/scansApi';

const getScansError = (bool, message) => ({
  type: types.GET_SCANS_ERROR,
  error: bool,
  message: message
});

const getScansLoading = bool => ({
  type: types.GET_SCANS_LOADING,
  loading: bool
});

const getScansSuccess = data => ({
  type: types.GET_SCANS_SUCCESS,
  data
});

const getScans = () => {
  return function(dispatch) {
    dispatch(getScansLoading(true));
    return scansApi
      .getScans()
      .then(success => {
        dispatch(getScansSuccess(success));
      })
      .catch(error => {
        dispatch(getScansError(true, error.message));
      })
      .finally(() => dispatch(getScansLoading(false)));
  };
};

export { getScansError, getScansLoading, getScansSuccess, getScans };
