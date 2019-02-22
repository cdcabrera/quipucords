import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import helpers from '../../common/helpers';

class FormState extends React.Component {
  constructor(props) {
    super(props);

    this.checked = {};
    this.errors = {};
    this.refValues =
      props.resetUsingInitialValues === true || props.allowUpdates === true ? _cloneDeep(props.initialValues) : null;

    this.touched = {};
    this.values = _cloneDeep(props.initialValues);

    this.state = {
      isUpdating: false,
      isSubmitting: false,
      isValidating: false,
      isValid: null,
      submitCount: 0
    };
  }

  componentDidMount() {
    const { validateOnmount } = this.props;

    if (validateOnmount === true) {
      this.validateOnMount();
    }
  }

  componentDidUpdate() {
    const { refValues } = this;
    const { allowUpdates, initialValues } = this.props;

    if (allowUpdates === true && !_isEqual(refValues, initialValues)) {
      this.updateComponent();
    }
  }

  onEventCustom = custom => {
    const eventArray = (Array.isArray(custom) && custom) || (custom && [custom]);

    if (!eventArray.length) {
      return;
    }

    eventArray
      .filter(event => 'name' in event && ('value' in event || 'checked' in event))
      .forEach(event => this.onEvent({ target: { ...event }, persist: helpers.noop, type: 'custom' }));
  };

  onEvent = event => {
    const { touched, values } = this;
    const { id, name, value, checked } = event.options ? { ...event } : event.target;

    event.persist();

    const targetName = name || id || 'generated form state target, add name or id attr to field';

    this.touched = { ...touched, [targetName]: true };
    this.values = { ...values, [targetName]: value };

    if (checked !== undefined) {
      this.checked = { ...this.checked, [targetName]: checked };
    }

    this.setState(
      {
        isUpdating: true,
        isValidating: true
      },
      () =>
        this.validate(event).then(updatedErrors => {
          const setErrors = { ...((updatedErrors && updatedErrors[0]) || updatedErrors || {}) };
          const checkIsValid = !Object.keys(setErrors).length;

          this.errors = setErrors;

          this.setState({
            isUpdating: false,
            isValidating: false,
            isValid: checkIsValid
          });
        })
    );
  };

  onReset = event => {
    const { refValues, values } = this;
    const { onReset, resetUsingInitialValues } = this.props;

    event.persist();

    const isResetWithInitialValues = refValues && resetUsingInitialValues === true;
    const updatedValues = (isResetWithInitialValues && _cloneDeep(refValues)) || {};

    this.values = updatedValues;
    this.checked = {};
    this.errors = {};
    this.touched = {};

    this.setState({
      isUpdating: false,
      isSubmitting: false,
      isValidating: false,
      isValid: null,
      submitCount: 0
    });

    if (isResetWithInitialValues) {
      onReset({ event, ..._cloneDeep({ values: updatedValues, prevValues: values }) });
    } else {
      // Resetting the values, potentially, will throw the controlled vs uncontrolled messaging.
      onReset({ event, values: {}, ..._cloneDeep({ prevValues: values }) });
    }
  };

  onSubmit = event => {
    const { submitCount } = this.state;

    event.persist();
    event.preventDefault();

    this.setState(
      {
        submitCount: submitCount + 1,
        isSubmitting: true,
        isUpdating: true,
        isValidating: true
      },
      () =>
        this.validate(event).then(updatedErrors => {
          const setErrors = { ...((updatedErrors && updatedErrors[0]) || updatedErrors || {}) };
          const checkIsValid = !Object.keys(setErrors).length;

          this.errors = setErrors;
          this.touched = {};

          this.setState(
            {
              isSubmitting: false,
              isUpdating: false,
              isValid: checkIsValid,
              isValidating: false
            },
            () => !Object.keys(updatedErrors).length && this.submit(event)
          );
        })
    );
  };

  submit(event) {
    const { checked, errors, values, touched } = this;
    const { onSubmit } = this.props;

    return Promise.resolve(onSubmit({ event, ..._cloneDeep({ ...this.state, checked, errors, values, touched }) }));
  }

  validate(event) {
    const { checked, errors, values, touched } = this;
    const { validate } = this.props;

    const checkPromise = validate({ event, ..._cloneDeep({ ...this.state, checked, errors, values, touched }) });

    if (Object.prototype.toString.call(checkPromise) === '[object Promise]') {
      return checkPromise;
    }

    return {
      then: callback => callback(checkPromise)
    };
  }

  validateOnMount(event) {
    const updatedEvent = event || {
      type: 'mount'
    };

    this.setState(
      {
        isUpdating: true,
        isValidating: true
      },
      () =>
        this.validate(updatedEvent).then(updatedErrors => {
          const setErrors = { ...((updatedErrors && updatedErrors[0]) || updatedErrors || {}) };
          const checkIsValid = !Object.keys(setErrors).length;

          this.errors = setErrors;

          this.setState({
            isUpdating: false,
            isValidating: false,
            isValid: checkIsValid
          });
        })
    );
  }

  updateComponent() {
    const { initialValues } = this.props;

    this.setState(
      {
        isUpdating: true
      },
      () => {
        this.refValues = initialValues;
        this.values = _cloneDeep(initialValues);

        this.setState({
          isUpdating: false
        });
      }
    );
  }

  render() {
    const { checked, errors, values, touched } = this;
    const { children } = this.props;

    return (
      <React.Fragment>
        {children({
          handleOnEventCustom: this.onEventCustom,
          handleOnEvent: this.onEvent,
          handleOnReset: this.onReset,
          handleOnSubmit: this.onSubmit,
          ..._cloneDeep({ ...this.state, checked, errors, values, touched })
        })}
      </React.Fragment>
    );
  }
}

FormState.propTypes = {
  allowUpdates: PropTypes.bool,
  children: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  resetUsingInitialValues: PropTypes.bool,
  validate: PropTypes.func,
  validateOnmount: PropTypes.bool
};

FormState.defaultProps = {
  allowUpdates: false,
  initialValues: {},
  onReset: helpers.noop,
  onSubmit: helpers.noop,
  resetUsingInitialValues: false,
  validate: helpers.noop,
  validateOnmount: false
};

export { FormState as default, FormState };
