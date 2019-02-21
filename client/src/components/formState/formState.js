import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import helpers from '../../common/helpers';

class FormState extends React.Component {
  constructor(props) {
    super(props);

    let refValues = null;

    if (props.resetRefValues === true) {
      refValues = _cloneDeep(props.initialValues);
    }

    this.state = {
      errors: {},
      isUpdating: false,
      isSubmitting: false,
      isValidating: false,
      isValid: null,
      refValues,
      submitCount: 0,
      touched: {},
      values: _cloneDeep(props.initialValues)
    };
  }

  componentDidMount() {
    const { validateOnmount } = this.props;

    if (validateOnmount === true) {
      this.validateOnMount();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialValues, resetRefValues } = this.props;

    if (resetRefValues === true && !_isEqual(prevState.refValues, initialValues)) {
      this.updateComponent();
    }
  }

  onEventCustom = custom => {
    if (!custom.name || !custom.value) {
      return;
    }

    this.onEvent({ target: { ...custom }, persist: helpers.noop, type: 'custom' });
  };

  onEvent = event => {
    const { touched, values } = this.state;
    const { id, name, value } = event.options ? { ...event } : event.target;

    event.persist();

    const targetName = name || id || 'generated form state target, add name or id attr to field';
    const updatedTouched = { ...touched, [targetName]: true };
    const updatedValues = { ...values, [targetName]: value };

    this.setState(
      {
        values: updatedValues,
        touched: updatedTouched,
        isUpdating: true,
        isValidating: true
      },
      () =>
        this.validate(event).then(updatedErrors => {
          const setErrors = { ...((updatedErrors && updatedErrors[0]) || updatedErrors || {}) };
          const checkIsValid = !Object.keys(setErrors).length;

          this.setState({
            errors: setErrors,
            isUpdating: false,
            isValidating: false,
            isValid: checkIsValid
          });
        })
    );
  };

  onReset = event => {
    const { refValues, values } = this.state;
    const { onReset, resetRefValues } = this.props;

    event.persist();

    if (refValues && resetRefValues === true) {
      const updatedValues = _cloneDeep(refValues);

      this.setState(
        {
          touched: {},
          submitCount: 0,
          values: updatedValues
        },
        () => onReset({ event, values: updatedValues, prevValues: values })
      );
    } else {
      onReset({ event, values });
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

          this.setState(
            {
              errors: setErrors,
              isSubmitting: false,
              isUpdating: false,
              isValid: checkIsValid,
              isValidating: false,
              touched: {}
            },
            () => !Object.keys(updatedErrors).length && this.submit(event)
          );
        })
    );
  };

  submit(event) {
    const { values } = this.state;
    const { onSubmit } = this.props;

    return Promise.resolve(onSubmit({ event, values }));
  }

  validate(event) {
    const { values } = this.state;
    const { validate } = this.props;

    const checkPromise = validate({ event, values });

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

          this.setState({
            errors: setErrors,
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
        const values = _cloneDeep(initialValues);
        this.setState({
          isUpdating: false,
          refValues: initialValues,
          values
        });
      }
    );
  }

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        {children({
          handleOnEventCustom: this.onEventCustom,
          handleOnEvent: this.onEvent,
          handleOnReset: this.onReset,
          handleOnSubmit: this.onSubmit,
          ...this.state
        })}
      </React.Fragment>
    );
  }
}

FormState.propTypes = {
  children: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  resetRefValues: PropTypes.bool,
  validate: PropTypes.func,
  validateOnmount: PropTypes.bool
};

FormState.defaultProps = {
  initialValues: {},
  onReset: helpers.noop,
  onSubmit: helpers.noop,
  resetRefValues: false,
  validate: helpers.noop,
  validateOnmount: false
};

export { FormState as default, FormState };
