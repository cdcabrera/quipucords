import confirmationModalReducer from '../confirmationModalReducer';
import { confirmationModalTypes as types } from '../../constants';

describe('ConfirmationModalReducer', () => {
  it('should return the initial state', () => {
    expect(confirmationModalReducer.initialState).toBeDefined();
  });

  it('should handle all defined types', () => {
    Object.keys(types).forEach(value => {
      const dispatched = {
        type: value
      };

      const resultState = confirmationModalReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined types ${value}`);
    });
  });
});
