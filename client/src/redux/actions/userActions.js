import { userTypes } from '../constants';
import UserService from '../../services/userService';

const getUser = () => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: userTypes.USER_INFO,
    payload: new UserService(authToken).whoami()
  });
};

const authorizeUser = () => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: userTypes.USER_AUTH,
    payload: new UserService(authToken).authorizeUser()
  });
};

const logoutUser = () => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: userTypes.USER_LOGOUT,
    payload: new UserService(authToken).logoutUser()
  });
};

export { getUser, authorizeUser, logoutUser };
