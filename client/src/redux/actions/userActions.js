import { userTypes } from '../constants';
import userService from '../../services/userService';

const getUser = data => dispatch => {
  return dispatch({
    type: userTypes.USER_INFO,
    payload: userService.whoami(data)
  });
};

const authorizeUser = data => dispatch => {
  return dispatch({
    type: userTypes.USER_AUTH,
    payload: userService.authorizeUser(data)
  });
};

const logoutUser = data => dispatch => {
  return dispatch({
    type: userTypes.USER_LOGOUT,
    payload: userService.logoutUser()
  });
};

export { getUser, authorizeUser, logoutUser };
