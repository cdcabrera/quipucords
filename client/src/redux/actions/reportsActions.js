import { reportsTypes } from '../constants';
import ReportsService from '../../services/reportsService';

const getReports = query => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: reportsTypes.GET_REPORTS,
    payload: new ReportsService(authToken).getReports(query)
  });
};

export { getReports };
