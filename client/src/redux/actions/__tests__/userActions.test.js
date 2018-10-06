import expect from 'expect';
import { reducers } from '../../reducers';

describe('UserActions', () => {
  it('Get the initial state', () => {
    expect(reducers.user.initialState).toBeDefined();
  });
});
