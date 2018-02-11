import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Radio,
  Button,
  Icon,
  Wizard,
  Form,
  Grid
} from 'patternfly-react';
import helpers from '../../common/helpers';
import { addSourceWizardSteps } from './addSourceWizardConstants';

import { connect } from 'react-redux';
import CreateCredentialDialog from '../createCredentialDialog/createCredentialDialog';
import {
  confirmationModalTypes,
  sourcesTypes,
  credentialsTypes
} from '../../redux/constants';
import Store from '../../redux/store';
import { addSource, updateSource } from '../../redux/actions/sourcesActions';
import { getCredentials } from '../../redux/actions/credentialsActions';

class AddSourceWizard extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      allCredentials: [],
      sourceCredentials: [],
      activeStepIndex: 0,
      stepOneValid: true,
      stepTwoValid: false,
      stepThreeValid: false,
      sourceType: 'network',
      sourceTypeError: '',
      sourceName: '',
      sourceNameError: '',
      addresses: [],
      addressesError: '',
      credentials: [],
      credentialsError: '',
      fileSelect: '',
      fileSelectError: ''
    };

    this.state = { ...this.initialState };

    helpers.bindMethods(this, [
      'onCancel',
      'onStep',
      'onNext',
      'onBack',
      'onSubmit',
      'updateFileSelect',
      'addCredential'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.resetInitialState(nextProps);
    }
  }

  componentDidMount() {
    this.props.getCredentials().then(response => {
      this.setState({
        allCredentials: response.value.results
      });
    });
  }

  resetInitialState(nextProps, step) {
    if (nextProps && nextProps.edit && nextProps.source) {
      // ToDo: setup for editing an existing source
    } else {
      switch (step) {
        case 0:
          this.setState(
            Object.assign(
              { ...this.initialState },
              {
                stepOneValid: !!this.state.sourceType,
                sourceType: this.state.sourceType || '',
                sourceTypeError: '',
                allCredentials: this.state.allCredentials
              }
            )
          );
          break;

        default:
          this.setState(
            Object.assign(
              { ...this.initialState },
              {
                allCredentials: this.state.allCredentials
              }
            )
          );
          break;
      }
    }
  }

  onCancel() {
    const { stepOneValid, stepTwoValid, stepThreeValid } = this.state;

    const stepsConfirmed = () =>
      new Promise(resolve =>
        setTimeout(() =>
          resolve(stepOneValid && stepTwoValid && stepThreeValid)
        )
      );

    const confirmationDialogAccepted = () => {
      Store.dispatch({
        type: confirmationModalTypes.CONFIRMATION_MODAL_HIDE
      });

      Store.dispatch({
        type: sourcesTypes.UPDATE_SOURCE_HIDE
      });
    };

    stepsConfirmed().then(confirmed => {
      if (confirmed) {
        Store.dispatch({
          type: sourcesTypes.UPDATE_SOURCE_HIDE
        });
      } else {
        Store.dispatch({
          type: confirmationModalTypes.CONFIRMATION_MODAL_SHOW,
          title: 'Cancel Add Source',
          heading: 'Are you sure you want to exit this wizard?',
          body: 'Exiting this wizard will cancel adding the source.',
          cancelButtonText: 'No',
          confirmButtonText: 'Yes',
          onConfirm: confirmationDialogAccepted
        });
      }
    });
  }

  onStep(stepIndex) {}

  onNext(event, submit) {
    const numberSteps = addSourceWizardSteps.length;
    let { activeStepIndex } = this.state;

    if (activeStepIndex < numberSteps - 1) {
      this.setState({ activeStepIndex: (activeStepIndex += 1) });
    }

    if (submit) {
      console.log('SAVING FORM...');
    }
  }

  onBack() {
    let { activeStepIndex } = this.state;
    let calcStep;

    if (activeStepIndex >= 1) {
      calcStep = activeStepIndex - 1;

      this.setState({ activeStepIndex: calcStep });

      this.resetInitialState(null, calcStep);
    }
  }

  onSubmit(event) {
    this.onNext(event, true);
  }

  validateUpdateSourceType(sourceType) {
    if (!sourceType) {
      return 'You must select a source type';
    }

    return '';
  }

  updateSourceType(event) {
    this.setState(
      {
        sourceType: event.target.value,
        sourceTypeError: this.validateUpdateSourceType(event.target.value)
      },
      () => this.validateStepOne()
    );
  }

  validateStepOne() {
    const { sourceTypeError } = this.state;

    if (sourceTypeError === '') {
      this.setState({ stepOneValid: true });
    }
  }

  renderStepOne() {
    const { sourceType, sourceTypeError } = this.state;

    return (
      <Form horizontal>
        <h3 className="right-aligned_basic-form">Select source type</h3>
        <Form.FormGroup validationState={sourceTypeError ? 'error' : null}>
          <Radio
            name="sourceType"
            value={'network'}
            checked={sourceType === 'network'}
            onChange={e => this.updateSourceType(e)}
          >
            Network range
          </Radio>
          <Radio
            name="sourceType"
            value={'import'}
            checked={sourceType === 'import'}
            onChange={e => this.updateSourceType(e)}
          >
            Import Sources
          </Radio>
          <Radio
            name="sourceType"
            value={'satellite'}
            checked={sourceType === 'satellite'}
            onChange={e => this.updateSourceType(e)}
          >
            Satellite
          </Radio>
          <Radio
            name="sourceType"
            value={'vcenter'}
            checked={sourceType === 'vcenter'}
            onChange={e => this.updateSourceType(e)}
          >
            vCenter Server
          </Radio>
        </Form.FormGroup>
      </Form>
    );
  }

  validateUpdateSourceName(sourceName) {
    if (!sourceName) {
      return 'You must enter a name';
    }

    return '';
  }

  updateSourceName(event) {
    this.setState(
      {
        sourceName: event.target.value,
        sourceNameError: this.validateUpdateSourceName(event.target.value)
      },
      () => {
        this.validateStepTwo();
        this.validateStepThree();
      }
    );
  }

  validateUpdateAddresses(addresses) {
    if (!addresses.length) {
      return 'You must enter an IP address';
    }

    return '';
  }

  updateAddresses(event, individual) {
    const value = event.target.value;
    let addresses = [];

    if (individual && value !== '') {
      addresses = [value];
    }

    this.setState(
      {
        addresses: addresses,
        addressesError: this.validateUpdateAddresses(addresses)
      },
      () => {
        this.validateStepTwo();
        this.validateStepThree();
      }
    );
  }

  validateFileSelect(fileSelect) {
    if (fileSelect === '') {
      return 'You must add a file';
    }

    return '';
  }

  updateFileSelect(event) {
    const value = event.target.value;

    this.setState(
      {
        fileSelect: value,
        fileSelectError: this.validateFileSelect(value)
      },
      () => {
        this.validateStepTwo();
        this.validateStepThree();
      }
    );
  }

  openAddFileSelect(event) {
    event.target.nextSibling.querySelector('input').click();
  }

  validateCredentials(credentials) {
    if (!credentials.length) {
      return 'You must add a credential';
    }

    return '';
  }

  addCredential() {
    const { sourceType } = this.state;

    Store.dispatch({
      type: credentialsTypes.CREATE_CREDENTIAL_SHOW,
      credentialType: sourceType === 'import' ? 'network' : sourceType
    });
  }

  updateCredentials(event, credential, individual) {
    let credentials = [];

    if (individual && credential) {
      credentials = [credential];
    }

    this.setState(
      {
        credentials: credentials,
        credentialsError: this.validateCredentials(credentials)
      },
      () => {
        this.validateStepTwo();
        this.validateStepThree();
      }
    );
  }

  validateStepTwo() {
    const {
      sourceType,
      sourceNameError,
      addressesError,
      credentialsError,
      fileSelectError
    } = this.state;

    let stepValid;

    switch (sourceType) {
      case 'network':
        break;
      case 'import':
        break;
      case 'vcenter':
      case 'satellite':
        if (
          sourceNameError === '' &&
          addressesError === '' &&
          credentialsError === ''
        ) {
          stepValid = true;
        }
        break;
      default:
        stepValid = false;
        break;
    }

    this.setState({ stepTwoValid: stepValid });
  }

  validateStepThree() {
    const { stepOneValid, stepTwoValid } = this.state;

    if (stepOneValid && stepTwoValid) {
      this.setState({ stepThreeValid: true });
    }
  }

  // ToDo: render and populate multiple credentials
  renderCredentials() {}

  renderStepTwo() {
    const {
      sourceType,
      sourceName,
      sourceNameError,
      addresses,
      addressesError,
      credentials,
      credentialsError,
      fileSelect,
      fileSelectError
    } = this.state;

    const FieldGroup = this.renderFieldGroup;

    switch (sourceType) {
      case 'network':
        return (
          <Form horizontal>
            <FieldGroup
              label={'Name'}
              validate={sourceNameError}
              validateMessage={sourceNameError}
            >
              <Form.FormControl
                type="text"
                value={sourceName}
                placeholder="Enter a source name"
                onChange={e => this.updateSourceName(e)}
              />
            </FieldGroup>

            <FieldGroup
              label={'Search Addresses'}
              validate={addressesError}
              validateMessage={addressesError}
            >
              <Form.FormControl
                componentClass="textarea"
                value={addresses}
                rows={5}
                placeholder="Enter an IP address:port"
                onChange={e => this.updateAddresses(e, true)}
              />
              <Form.HelpBlock>
                Comma separated, IP ranges, dns, and wildcards are valid.
              </Form.HelpBlock>
            </FieldGroup>

            <FieldGroup
              label={'Credentials'}
              validate={credentialsError}
              validateMessage={credentialsError}
            >
              <Form.InputGroup>
                <Form.FormControl
                  type="text"
                  value={credentials}
                  placeholder="Add a credential"
                  onChange={e => this.updateCredentials(e, true)}
                />
                <Form.InputGroup.Button>
                  <Button onClick={this.addCredential} title="Add a credential">
                    <span className="sr-only">Add</span>
                    <Icon type="fa" name="plus" />
                  </Button>
                </Form.InputGroup.Button>
              </Form.InputGroup>
            </FieldGroup>
          </Form>
        );

      case 'import':
        return (
          <Form horizontal>
            <FieldGroup
              label={'Name'}
              validate={sourceNameError}
              validateMessage={sourceNameError}
            >
              <Form.FormControl
                type="text"
                value={sourceName}
                placeholder="Enter a source name"
                onChange={e => this.updateSourceName(e)}
              />
            </FieldGroup>

            <FieldGroup
              label={'File'}
              validate={fileSelect}
              validateMessage={fileSelectError}
            >
              <Form.InputGroup>
                <Button onClick={this.openAddFileSelect} title="Select file">
                  Select File
                </Button>
                <span className="sr-only">
                  <Form.FormControl
                    type="file"
                    value={fileSelect}
                    placeholder="Select file to import"
                    onChange={this.updateFileSelect}
                  />
                </span>
                <span className="text-nowrap">
                  {fileSelect !== ''
                    ? ` ${fileSelect.replace(/^.*[\\/]/, '')}`
                    : ' No file selected'}
                </span>
              </Form.InputGroup>
            </FieldGroup>

            <FieldGroup
              label={'Credentials'}
              validate={credentialsError}
              validateMessage={credentialsError}
            >
              <Form.InputGroup>
                <Form.FormControl
                  type="text"
                  value={credentials}
                  placeholder="Add a credential"
                  onChange={e => this.updateCredentials(e, true)}
                />
                <Form.InputGroup.Button>
                  <Button onClick={this.addCredential} title="Add a credential">
                    <span className="sr-only">Add</span>
                    <Icon type="fa" name="plus" />
                  </Button>
                </Form.InputGroup.Button>
              </Form.InputGroup>
            </FieldGroup>
          </Form>
        );

      case 'vcenter':
      case 'satellite':
        return (
          <Form horizontal>
            <FieldGroup
              label={'Name'}
              validate={sourceNameError}
              validateMessage={sourceNameError}
            >
              <Form.FormControl
                type="text"
                value={sourceName}
                placeholder="Enter a source name"
                onChange={e => this.updateSourceName(e)}
              />
            </FieldGroup>

            <FieldGroup
              label={'IP Address:Port'}
              validate={addressesError}
              validateMessage={addressesError}
            >
              <Form.FormControl
                type="text"
                value={addresses}
                placeholder="Enter an IP address:port"
                onChange={e => this.updateAddresses(e, true)}
              />
            </FieldGroup>

            <FieldGroup
              label={'Credentials'}
              validate={credentialsError}
              validateMessage={credentialsError}
            >
              <Form.InputGroup>
                <Form.FormControl
                  type="text"
                  value={credentials}
                  placeholder="Add a credential"
                  onChange={e => this.updateCredentials(e, true)}
                />
                <Form.InputGroup.Button>
                  <Button onClick={this.addCredential} title="Add a credential">
                    <span className="sr-only">Add</span>
                    <Icon type="fa" name="plus" />
                  </Button>
                </Form.InputGroup.Button>
              </Form.InputGroup>
            </FieldGroup>
          </Form>
        );

      default:
        return null;
    }
  }

  renderStepThree() {
    const { sourceType } = this.state;

    return (
      <div>
        <p>Searching {sourceType} for hosts...</p>
        <p>
          You can dismiss this and receive a notification when the search is
          complete.
        </p>
      </div>
    );
  }

  renderFieldGroup({
    children,
    id,
    colLabel = 3,
    colField = 9,
    label,
    validate,
    validateMessage,
    ...props
  }) {
    const setId = id || `generatedid-${Math.ceil(1e5 * Math.random())}`;

    return (
      <Form.FormGroup
        controlId={setId}
        validationState={validate ? 'error' : null}
        {...props}
      >
        <Grid.Col componentClass={Form.ControlLabel} sm={colLabel}>
          {label}
        </Grid.Col>
        <Grid.Col sm={colField}>
          {children}
          {validate && <Form.HelpBlock>{validateMessage}</Form.HelpBlock>}
        </Grid.Col>
      </Form.FormGroup>
    );
  }

  renderWizardContent(wizardSteps, activeStepIndex) {
    return wizardSteps.map((step, stepIndex) => {
      let stepContent;

      switch (stepIndex) {
        case 0:
          stepContent = this.renderStepOne();
          break;
        case 1:
          stepContent = this.renderStepTwo();
          break;
        case 2:
          stepContent = this.renderStepThree();
          break;
        default:
          stepContent = null;
          break;
      }

      return (
        <Wizard.Contents
          key={step.title}
          stepIndex={stepIndex}
          activeStepIndex={activeStepIndex}
        >
          {stepContent}
        </Wizard.Contents>
      );
    });
  }

  renderWizardSteps(wizardSteps, activeStepIndex, onStep) {
    const activeStep = wizardSteps[activeStepIndex];

    return wizardSteps.map((step, stepIndex) => {
      return (
        <Wizard.Step
          key={stepIndex}
          stepIndex={stepIndex}
          step={step.step}
          label={step.label}
          title={step.title}
          activeStep={activeStep && activeStep.step}
          onClick={e => onStep(activeStep && activeStep.step)}
        />
      );
    });
  }

  render() {
    const { show } = this.props;
    const {
      activeStepIndex,
      stepOneValid,
      stepTwoValid,
      stepThreeValid
    } = this.state;

    return (
      <React.Fragment>
        <CreateCredentialDialog />
        <Modal
          show={show}
          onHide={this.onCancel}
          dialogClassName="modal-dialog modal-lg wizard-pf quipucords-wizard"
        >
          <Wizard>
            <Modal.Header>
              <button
                className="close"
                onClick={this.onCancel}
                aria-hidden="true"
                aria-label="Close"
              >
                <Icon type="pf" name="close" />
              </button>
              <Modal.Title>Add Source</Modal.Title>
            </Modal.Header>
            <Modal.Body className="wizard-pf-body clearfix">
              <Wizard.Steps
                steps={this.renderWizardSteps(
                  addSourceWizardSteps,
                  activeStepIndex,
                  this.onStep
                )}
              />
              <Wizard.Row>
                <Wizard.Main>
                  {this.renderWizardContent(
                    addSourceWizardSteps,
                    activeStepIndex
                  )}
                </Wizard.Main>
              </Wizard.Row>
            </Modal.Body>
            <Modal.Footer className="wizard-pf-footer">
              <Button
                bsStyle="default"
                className="btn-cancel"
                onClick={this.onCancel}
              >
                Cancel
              </Button>
              <Button
                bsStyle="default"
                disabled={activeStepIndex === 0 || activeStepIndex === 2}
                onClick={this.onBack}
              >
                <Icon type="fa" name="angle-left" />Back
              </Button>
              {activeStepIndex === 0 && (
                <Button
                  bsStyle="primary"
                  disabled={!stepOneValid}
                  onClick={this.onNext}
                >
                  Next<Icon type="fa" name="angle-right" />
                </Button>
              )}
              {activeStepIndex === 1 && (
                <Button
                  bsStyle="primary"
                  disabled={!stepTwoValid}
                  onClick={this.onSubmit}
                >
                  Save<Icon type="fa" name="angle-right" />
                </Button>
              )}
              {activeStepIndex === 2 && (
                <Button
                  bsStyle="primary"
                  disabled={!stepThreeValid}
                  onClick={this.onCancel}
                >
                  Close
                </Button>
              )}
            </Modal.Footer>
          </Wizard>
        </Modal>
      </React.Fragment>
    );
  }
}

AddSourceWizard.propTypes = {
  addSource: PropTypes.func,
  sourceCredentials: PropTypes.array,
  edit: PropTypes.bool,
  getCredentials: PropTypes.func,
  show: PropTypes.bool.isRequired,
  source: PropTypes.object,
  updateSource: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addSource: data => dispatch(addSource(data)),
  getCredentials: () => dispatch(getCredentials()),
  updateSource: (id, data) => dispatch(updateSource(id, data))
});

const mapStateToProps = function(state) {
  return Object.assign({}, state.sources.update);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSourceWizard);
