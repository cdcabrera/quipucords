import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import helpers from '../../common/helpers';

class FormState extends React.Component {
  constructor(props) {
    super(props);

    this.errors = {};
    this.refValues = props.resetRefValues === true ? _cloneDeep(props.initialValues) : null;
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
    const { initialValues, resetRefValues } = this.props;

    if (resetRefValues === true && !_isEqual(refValues, initialValues)) {
      this.updateComponent();
    }
  }

  onEventCustom = custom => {
    const eventArray = (Array.isArray(custom) && custom) || (custom && [custom]);

    if (!eventArray.length) {
      return;
    }

    eventArray
      .filter(event => 'name' in event && 'value' in event)
      .forEach(event => this.onEvent({ target: { ...event }, persist: helpers.noop, type: 'custom' }));
  };

  onEvent = event => {
    const { touched, values } = this;
    const { id, name, value } = event.options ? { ...event } : event.target;

    event.persist();

    const targetName = name || id || 'generated form state target, add name or id attr to field';

    this.touched = { ...touched, [targetName]: true };
    this.values = { ...values, [targetName]: value };

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
    const { onReset, resetRefValues } = this.props;

    event.persist();

    if (refValues && resetRefValues === true) {
      const updatedValues = _cloneDeep(refValues);

      this.touched = {};
      this.values = updatedValues;

      this.setState(
        {
          submitCount: 0
        },
        () => onReset({ event, ..._cloneDeep({ values: updatedValues, prevValues: values }) })
      );
    } else {
      onReset({ event, ..._cloneDeep(values) });
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
    const { values, errors, touched } = this;
    const { onSubmit } = this.props;

    return Promise.resolve(onSubmit(_cloneDeep({ event, ...this.state, values, errors, touched })));
  }

  validate(event) {
    const { values, errors, touched } = this;
    const { validate } = this.props;

    const checkPromise = validate(_cloneDeep({ event, ...this.state, values, errors, touched }));

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
    const { values, errors, touched } = this;
    const { children } = this.props;

    return (
      <React.Fragment>
        {children({
          handleOnEventCustom: this.onEventCustom,
          handleOnEvent: this.onEvent,
          handleOnReset: this.onReset,
          handleOnSubmit: this.onSubmit,
          ..._cloneDeep({ ...this.state, values, errors, touched })
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
