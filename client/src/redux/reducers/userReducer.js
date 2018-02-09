import { userTypes } from '../constants';

const initialState = {
  error: false,
  errorMessage: '',
  loading: true,
  data: {}
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
