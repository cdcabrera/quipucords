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
      refValues,
      submitCount: 0,
      touched: {},
      values: _cloneDeep(props.initialValues)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialValues, resetRefValues } = this.props;

    if (resetRefValues === true && !_isEqual(prevState.refValues, initialValues)) {
      this.updateComponent();
    }
  }

  onEvent = event => {
    const { touched, values } = this.state;
    const { name, value } = event.target;

    const updatedTouched = { ...touched, [name]: true };
    const updatedValues = { ...values, [name]: value };

    event.persist();

    this.setState(
      {
        values: updatedValues,
        touched: updatedTouched,
        isUpdating: true,
        isValidating: true
      },
      () =>
        this.validate(event).then(updatedErrors => {
          this.setState({
            isUpdating: false,
            isValidating: false,
            errors: { ...(updatedErrors[0] || updatedErrors || {}) }
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
    const { errors, submitCount } = this.state;

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
          this.setState(
            {
              errors: { ...errors, ...(updatedErrors[0] || updatedErrors || {}) },
              isSubmitting: false,
              isUpdating: false,
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
  validate: PropTypes.func
};

FormState.defaultProps = {
  initialValues: {},
  onReset: helpers.noop,
  onSubmit: helpers.noop,
  resetRefValues: false,
  validate: helpers.noop
};

export { FormState as default, FormState };
