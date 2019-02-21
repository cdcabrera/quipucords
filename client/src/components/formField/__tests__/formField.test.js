import React from 'react';
import { mount } from 'enzyme';
import { FormField, fieldValidation } from '../formField';

describe('FormField Component', () => {
  it('should render', () => {
    const props = { id: 'test' };

    const component = mount(
      <FormField {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormField>
    );

    expect(component.render()).toMatchSnapshot();
    expect(
      component
        .find('label')
        .at(0)
        .render()
    ).toMatchSnapshot();
  });

  it('should have isEmpty validation', () => {
    expect(fieldValidation.isEmpty('')).toBe(true);
    expect(fieldValidation.isEmpty('test')).toBe(false);
  });

  it('should have doesntHaveMinimumCharacters validation', () => {
    expect(fieldValidation.doesntHaveMinimumCharacters('', 5)).toBe(true);
    expect(fieldValidation.doesntHaveMinimumCharacters('test test', 5)).toBe(false);
  });

  it('should have isPortValid validation', () => {
    expect(fieldValidation.isPortValid('weeeeee')).toBe(false);
    expect(fieldValidation.isPortValid(-1)).toBe(false);
    expect(fieldValidation.isPortValid(65536)).toBe(false);
    expect(fieldValidation.isPortValid('65536')).toBe(false);
    expect(fieldValidation.isPortValid(65535)).toBe(true);
  });
});
