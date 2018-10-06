import expect from 'expect';
import { reducers } from '../../reducers';

describe('FactsActions', () => {
  it('Get the initial state', () => {
    expect(reducers.facts.initialState).toBeDefined();
  });
});
