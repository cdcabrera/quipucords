import React from 'react';
import { mount } from 'enzyme';
import { FormState } from '../formState';

describe('FormState Component', () => {
  it('should render a basic component', () => {
    const props = { resetRefValues: true, initialValues: { lorem: 'ipsum' } };

    const component = mount(
      <FormState {...props}>
        {({ values }) => (
          <form>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} readOnly type="text" />
            </label>
          </form>
        )}
      </FormState>
    );

    const componentInstance = component.instance();
    expect(componentInstance.props).toMatchSnapshot('initial props');
    expect(componentInstance.state).toMatchSnapshot('initial state');

    expect(component.render()).toMatchSnapshot('basic render');
  });

  it('should update handle change and submits events while updating state', () => {
    const props = { initialValues: { lorem: 'ipsum' }, validate: () => ({}) };

    const component = mount(
      <FormState {...props}>
        {({ values, handleOnEvent, handleOnSubmit }) => (
          <form onSubmit={handleOnSubmit}>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} type="text" onChange={handleOnEvent} />
            </label>
            <button type="submit">Submit</button>
          </form>
        )}
      </FormState>
    );

    const componentInstance = component.instance();
    const mockEvent = { target: { value: 'dolor', name: 'lorem' }, persist: () => {}, preventDefault: () => {} };
    componentInstance.onEvent(mockEvent);
    expect(component.state()).toMatchSnapshot('onevent');

    componentInstance.onSubmit({ persist: () => {}, preventDefault: () => {} });
    expect(component.state()).toMatchSnapshot('onsubmit');
  });

  it('should do a basic validation check', () => {
    const props = {
      initialValues: {
        lorem: 'ipsum'
      },
      validate: ({ values }) => {
        const updatedErrors = {};

        if (!values.lorem) {
          updatedErrors.lorem = 'required';
        }

        return updatedErrors;
      }
    };

    const component = mount(
      <FormState {...props}>
        {({ errors, values, handleOnEvent }) => (
          <form>
            <label>
              Lorem
              <input id="lorem" value={values.lorem} type="text" onChange={handleOnEvent} />
              <span className="error">{errors.lorem}</span>
            </label>
          </form>
        )}
      </FormState>
    );

    const mockEvent = { target: { value: '', id: 'lorem' }, persist: () => {}, preventDefault: () => {} };
    component.instance().onEvent(mockEvent);
    expect(component.state()).toMatchSnapshot('basic validation');
  });

  it('should handle custom events', () => {
    const props = {
      initialValues: {
        lorem: 'ipsum',
        dolor: ''
      },
      validate: ({ values }) => {
        const updatedErrors = {};

        if (!values.lorem) {
          updatedErrors.lorem = 'required';
        }

        return updatedErrors;
      }
    };

    const component = mount(
      <FormState {...props}>
        {({ errors, values, handleOnEventCustom }) => (
          <form>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} type="text" onChange={handleOnEventCustom} />
              <span className="error">{errors.lorem}</span>
              <input name="dolor" value={values.dolor} type="hidden" />
            </label>
          </form>
        )}
      </FormState>
    );

    component.instance().onEventCustom({ name: 'lorem', value: 'woot' });
    expect(component.state()).toMatchSnapshot('single custom event');

    component.instance().onEventCustom([{ name: 'lorem', value: 'woot again' }, { name: 'dolor', value: 'sit' }]);
    expect(component.state()).toMatchSnapshot('multiple custom events');
  });
});
