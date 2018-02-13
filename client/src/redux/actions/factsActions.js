import { factsTypes } from '../constants';
import FactsService from '../../services/factsService';

const addFacts = data => (dispatch, getState) => {
  const { authToken } = getState().user.session;

  return dispatch({
    type: factsTypes.ADD_FACTS,
    payload: new FactsService(authToken).addFacts(data)
  });
};

export { addFacts };
