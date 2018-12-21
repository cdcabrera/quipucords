import axios from 'axios';
import cookies from 'js-cookie';
import serviceConfig from './config';
import helpers from '../common/helpers';

const authorizeUser = () => {
  if (helpers.DEV_MODE || helpers.TEST_MODE) {
    cookies.set(process.env.REACT_APP_AUTH_TOKEN, 'spoof');
    console.warn('Warning: Loading spoof auth token.');
  }

  const token = cookies.get(process.env.REACT_APP_AUTH_TOKEN);

  return new Promise(resolve => {
    if (token) {
      return resolve({
        authToken: token
      });
    }

    throw new Error('User not authorized.');
  });
};

const whoami = () =>
  axios(
    serviceConfig({
      method: 'get',
      url: process.env.REACT_APP_USER_SERVICE_CURRENT
    })
  );

const logoutUser = () =>
  axios(
    serviceConfig({
      method: 'put',
      url: process.env.REACT_APP_USER_SERVICE_LOGOUT
    })
  );

const userService = { authorizeUser, whoami, logoutUser };

export { userService as default, userService, authorizeUser, whoami, logoutUser };
