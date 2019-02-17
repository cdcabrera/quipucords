import React from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'patternfly-react';
import { connect, store, reduxSelectors, reduxTypes } from '../../redux';
import apiTypes from '../../constants/apiConstants';

class AddSourceWizardStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type
    };
  }

  componentDidMount() {
    this.isStepValid();
  }

  onChangeSourceType = event => {
    const { value } = event.target;

    this.setState({ type: value }, () => this.isStepValid());
  };

  onSubmit = event => {
    event.preventDefault();
  };

  isStepValid() {
    const { type } = this.state;

    store.dispatch({
      type: reduxTypes.sources.UPDATE_SOURCE_WIZARD_STEPONE,
      source: {
        [apiTypes.API_SUBMIT_SOURCE_SOURCE_TYPE]: type
      }
    });
  }

  render() {
    const { type } = this.props;

    return (
      <Form horizontal onSubmit={this.onSubmit}>
        <h3 className="right-aligned_basic-form">Select source type</h3>
        <Form.FormGroup>
          <Radio name="sourceType" value="network" checked={type === 'network'} onChange={this.onChangeSourceType}>
            Network Range
          </Radio>
          <Radio name="sourceType" value="satellite" checked={type === 'satellite'} onChange={this.onChangeSourceType}>
            Satellite
          </Radio>
          <Radio name="sourceType" value="vcenter" checked={type === 'vcenter'} onChange={this.onChangeSourceType}>
            vCenter Server
          </Radio>
        </Form.FormGroup>
      </Form>
    );
  }
}

AddSourceWizardStepOne.propTypes = {
  type: PropTypes.string
};

AddSourceWizardStepOne.defaultProps = {
  type: 'network'
};

const makeMapStateToProps = () => {
  const mapSource = reduxSelectors.sources.makeSourceDetail();

  return (state, props) => ({
    ...state.addSourceWizard,
    ...mapSource(state, props)
  });
};

const ConnectedAddSourceWizardStepOne = connect(makeMapStateToProps)(AddSourceWizardStepOne);

export { ConnectedAddSourceWizardStepOne as default, ConnectedAddSourceWizardStepOne, AddSourceWizardStepOne };
