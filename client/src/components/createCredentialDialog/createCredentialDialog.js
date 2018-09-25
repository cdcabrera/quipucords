import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Alert, Button, Icon, Form, Grid, MenuItem } from 'patternfly-react';
import Store from '../../redux/store';
import { helpers } from '../../common/helpers';
import reduxTypes from '../../redux/constants';
import reduxActions from '../../redux/actions';
import DropdownSelect from '../dropdownSelect/dropdownSelect';

// ToDo: evaluate "sudo" as the default for becomeMethod
const initialState = {
  credentialName: '',
  credentialType: '',
  authorizationType: 'usernamePassword',
  sshKeyFile: '',
  passphrase: '',
  username: '',
  password: '',
  becomeMethod: 'sudo',
  becomeUser: '',
  becomePassword: '',
  credentialNameError: '',
  usernameError: '',
  sskKeyFileError: '',
  becomeUserError: '',
  sshKeyDisabled: false
};

class CreateCredentialDialog extends React.Component {
  static renderFormLabel(label) {
    return (
      <Grid.Col componentClass={Form.ControlLabel} sm={5}>
        {label}
      </Grid.Col>
    );
  }

  static validateCredentialName(credentialName) {
    if (!credentialName) {
      return 'You must enter a credential name';
    }

    if (credentialName.length > 64) {
      return 'The credential name can only contain up to 64 characters';
    }

    return '';
  }

  static validateUsername(username) {
    if (!username || !username.length) {
      return 'You must enter a user name';
    }

    return '';
  }

  static validatePassword(password) {
    if (!password || !password.length) {
      return 'You must enter a password';
    }

    return '';
  }

  constructor() {
    super();

    this.state = { ...initialState };

    this.sshKeyFileValidator = new RegExp(/^\/.*$/);

    this.becomeMethods = ['sudo', 'su', 'pbrun', 'pfexec', 'doas', 'dzdo', 'ksu', 'runas'];
  }

  // FixMe: convert componentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    const { edit, fulfilled, getCredentials, show, viewOptions } = this.props;

    if (!show && nextProps.show) {
      this.resetInitialState(nextProps);
    }

    if (show && nextProps.fulfilled && !fulfilled) {
      Store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'success',
        message: (
          <span>
            Credential <strong>{nextProps.credential.name}</strong> successfully
            {edit ? ' updated' : ' added'}.
          </span>
        )
      });

      this.onCancel();
      getCredentials(helpers.createViewQueryObject(viewOptions));
    }
  }

  onCancel = () => {
    Store.dispatch({
      type: reduxTypes.credentials.UPDATE_CREDENTIAL_HIDE
    });
  };

  onSave = () => {
    const {
      authorizationType,
      becomeMethod,
      becomeUser,
      becomePassword,
      credentialName,
      credentialType,
      passphrase,
      password,
      sshKeyFile,
      username
    } = this.state;
    const { addCredential, credential, edit, getWizardCredentials, updateCredential } = this.props;

    const updatedCredential = {
      username,
      name: credentialName
    };

    if (edit) {
      updatedCredential.id = credential.id;
    } else {
      updatedCredential.cred_type = credentialType;
    }

    if (authorizationType === 'sshKey') {
      updatedCredential.ssh_keyfile = sshKeyFile;
      updatedCredential.sshpassphrase = passphrase;
    } else {
      updatedCredential.password = password;
    }

    if (credentialType === 'network') {
      updatedCredential.become_method = becomeMethod;
      if (becomeUser) {
        updatedCredential.become_user = becomeUser;
      }
      if (becomePassword) {
        updatedCredential.become_password = becomePassword;
      }
    }

    if (edit) {
      updateCredential(updatedCredential.id, updatedCredential);
    } else {
      addCredential(updatedCredential).finally(() => {
        getWizardCredentials();
      });
    }
  };

  onErrorDismissed = () => {
    Store.dispatch({
      type: reduxTypes.credentials.RESET_CREDENTIAL_UPDATE_STATUS
    });
  };

  setAuthType(authType) {
    this.setState({ authorizationType: authType });
  }

  setBecomeMethod(method) {
    this.setState({
      becomeMethod: method
    });
  }

  updateCredentialName(event) {
    this.setState({
      credentialName: event.target.value,
      credentialNameError: CreateCredentialDialog.validateCredentialName(event.target.value)
    });
  }

  updateUsername(event) {
    this.setState({
      username: event.target.value,
      usernameError: CreateCredentialDialog.validateUsername(event.target.value)
    });
  }

  updatePassword(event) {
    this.setState({
      password: event.target.value,
      passwordError: CreateCredentialDialog.validatePassword(event.target.value)
    });
  }

  updateSshKeyFile(event) {
    this.setState({
      sshKeyFile: event.target.value,
      sskKeyFileError: this.validateSshKeyFile(event.target.value)
    });
  }

  updatePassphrase(event) {
    this.setState({
      passphrase: event.target.value
    });
  }

  updateBecomeUser(event) {
    this.setState({
      becomeUser: event.target.value
    });
  }

  updateBecomePassword(event) {
    this.setState({
      becomePassword: event.target.value
    });
  }

  validateForm() {
    const {
      authorizationType,
      credentialName,
      credentialNameError,
      password,
      passwordError,
      sshKeyFile,
      sskKeyFileError,
      username,
      usernameError
    } = this.state;

    return (
      credentialName &&
      !credentialNameError &&
      username &&
      !usernameError &&
      (authorizationType === 'usernamePassword' ? password && !passwordError : sshKeyFile && !sskKeyFileError)
    );
  }

  validateSshKeyFile(keyFile) {
    if (!this.sshKeyFileValidator.test(keyFile)) {
      return 'Please enter the full path to the SSH Key File';
    }

    return '';
  }

  resetInitialState(nextProps) {
    let sshKeyDisabled = true;

    if (nextProps.edit && nextProps.credential) {
      if (nextProps.credential.cred_type === 'network' || nextProps.credential.ssh_keyfile) {
        sshKeyDisabled = false;
      }

      this.setState({
        credentialName: nextProps.credential.name,
        credentialType: nextProps.credential.cred_type,
        authorizationType: nextProps.credential.ssh_keyfile ? 'sshKey' : 'usernamePassword',
        sshKeyFile: nextProps.credential.ssh_keyfile,
        passphrase: nextProps.credential.passphrase,
        username: nextProps.credential.username,
        password: nextProps.credential.password,
        becomeMethod: nextProps.credential.become_method,
        becomeUser: nextProps.credential.become_user,
        becomePassword: nextProps.credential.become_password,
        credentialNameError: '',
        usernameError: '',
        sskKeyFileError: '',
        becomeUserError: '',
        sshKeyDisabled
      });
    } else {
      if (nextProps.credentialType === 'network') {
        sshKeyDisabled = false;
      }

      this.setState({
        ...initialState,
        credentialType: nextProps.credentialType,
        sshKeyDisabled
      });
    }
  }

  renderAuthForm() {
    const {
      authorizationType,
      password,
      sshKeyFile,
      passphrase,
      passwordError,
      sskKeyFileError,
      sshKeyDisabled
    } = this.state;

    switch (authorizationType) {
      case 'usernamePassword':
        return (
          <Form.FormGroup validationState={passwordError ? 'error' : null}>
            {CreateCredentialDialog.renderFormLabel('Password')}
            <Grid.Col sm={7}>
              <Form.FormControl
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={e => this.updatePassword(e)}
              />
              {passwordError && <Form.HelpBlock>{passwordError}</Form.HelpBlock>}
            </Grid.Col>
          </Form.FormGroup>
        );

      case 'sshKey':
        if (sshKeyDisabled) {
          return null;
        }

        return (
          <React.Fragment>
            <Form.FormGroup validationState={sskKeyFileError ? 'error' : null}>
              {CreateCredentialDialog.renderFormLabel('SSH Key File')}
              <Grid.Col sm={7}>
                <Form.FormControl
                  type="text"
                  value={sshKeyFile}
                  placeholder="Enter the full path to the SSH key file"
                  onChange={e => this.updateSshKeyFile(e)}
                />
                {sskKeyFileError && <Form.HelpBlock>{sskKeyFileError}</Form.HelpBlock>}
              </Grid.Col>
            </Form.FormGroup>
            <Form.FormGroup>
              {CreateCredentialDialog.renderFormLabel('Passphrase')}
              <Grid.Col sm={7}>
                <Form.FormControl
                  type="password"
                  value={passphrase}
                  placeholder="optional"
                  onChange={e => this.updatePassphrase(e)}
                />
              </Grid.Col>
            </Form.FormGroup>
          </React.Fragment>
        );
      default:
        return null;
    }
  }

  renderNetworkForm() {
    const { credentialType, becomeMethod, becomeUser, becomePassword, becomeUserError } = this.state;

    if (credentialType !== 'network') {
      return null;
    }

    return (
      <React.Fragment>
        <Form.FormGroup>
          {CreateCredentialDialog.renderFormLabel('Become Method')}
          <Grid.Col sm={7}>
            <div className="quipucords-dropdownselect">
              <DropdownSelect
                title={becomeMethod}
                id="become-method-select"
                className="form-control"
                multiselect={false}
              >
                {this.becomeMethods.map((nextMethod, index) => (
                  <MenuItem
                    key={nextMethod}
                    className={{ 'quipucords-dropdownselect-menuitem-selected': nextMethod === becomeMethod }}
                    eventKey={`become${index}`}
                    onClick={() => this.setBecomeMethod(nextMethod)}
                  >
                    {nextMethod}
                  </MenuItem>
                ))}
              </DropdownSelect>
            </div>
          </Grid.Col>
        </Form.FormGroup>
        <Form.FormGroup validationState={becomeUserError ? 'error' : null}>
          {CreateCredentialDialog.renderFormLabel('Become User')}
          <Grid.Col sm={7}>
            <Form.FormControl
              type="text"
              placeholder="optional"
              value={becomeUser}
              onChange={e => this.updateBecomeUser(e)}
            />
          </Grid.Col>
        </Form.FormGroup>
        <Form.FormGroup>
          {CreateCredentialDialog.renderFormLabel('Become Password')}
          <Grid.Col sm={7}>
            <Form.FormControl
              type="password"
              value={becomePassword}
              placeholder="optional"
              onChange={e => this.updateBecomePassword(e)}
            />
          </Grid.Col>
        </Form.FormGroup>
      </React.Fragment>
    );
  }

  renderErrorMessage() {
    const { error, errorMessage } = this.props;

    if (error) {
      return (
        <Alert type="error" onDismiss={this.onErrorDismissed}>
          <strong>Error</strong> {errorMessage}
        </Alert>
      );
    }

    return null;
  }

  render() {
    const { show, edit } = this.props;
    const {
      credentialType,
      credentialName,
      authorizationType,
      username,
      credentialNameError,
      usernameError,
      sshKeyDisabled
    } = this.state;

    return (
      <Modal show={show} onHide={this.onCancel}>
        <Modal.Header>
          <Button className="close" onClick={this.onCancel} aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </Button>
          <Modal.Title>{edit ? `Edit Credential - ${credentialName}` : 'Add Credential'}</Modal.Title>
        </Modal.Header>
        <Modal.Body />
        <Grid fluid>
          {this.renderErrorMessage()}
          <Form horizontal>
            <Form.FormGroup>
              {CreateCredentialDialog.renderFormLabel('Source Type')}
              <Grid.Col sm={7}>
                <Form.FormControl
                  className="quipucords-form-control"
                  type="text"
                  readOnly
                  value={helpers.sourceTypeString(credentialType)}
                />
              </Grid.Col>
            </Form.FormGroup>
            <Form.FormGroup validationState={credentialNameError ? 'error' : null}>
              {CreateCredentialDialog.renderFormLabel('Credential Name')}
              <Grid.Col sm={7}>
                <Form.FormControl
                  type="text"
                  className="quipucords-form-control"
                  placeholder="Enter a name for the credential"
                  autoFocus={!edit}
                  value={credentialName}
                  onChange={e => this.updateCredentialName(e)}
                />
                {credentialNameError && <Form.HelpBlock>{credentialNameError}</Form.HelpBlock>}
              </Grid.Col>
            </Form.FormGroup>
            {!sshKeyDisabled && (
              <Form.FormGroup>
                {CreateCredentialDialog.renderFormLabel('Authentication Type')}
                <Grid.Col sm={7}>
                  <div className="quipucords-dropdownselect">
                    <DropdownSelect
                      title={helpers.authorizationTypeString(authorizationType)}
                      id="auth-type-select"
                      className="form-control"
                      multiselect={false}
                    >
                      <MenuItem
                        key="usernamePassword"
                        className={{
                          'quipucords-dropdownselect-menuitem-selected': authorizationType === 'usernamePassword'
                        }}
                        eventKey="1"
                        onClick={() => this.setAuthType('usernamePassword')}
                      >
                        {helpers.authorizationTypeString('usernamePassword')}
                      </MenuItem>
                      <MenuItem
                        key="sshKey"
                        className={{ 'quipucords-dropdownselect-menuitem-selected': authorizationType === 'sshKey' }}
                        eventKey="2"
                        onClick={() => this.setAuthType('sshKey')}
                      >
                        {helpers.authorizationTypeString('sshKey')}
                      </MenuItem>
                    </DropdownSelect>
                  </div>
                </Grid.Col>
              </Form.FormGroup>
            )}
            <Form.FormGroup validationState={usernameError ? 'error' : null}>
              {CreateCredentialDialog.renderFormLabel('Username')}
              <Grid.Col sm={7}>
                <Form.FormControl
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={e => this.updateUsername(e)}
                />
                {usernameError && <Form.HelpBlock>{usernameError}</Form.HelpBlock>}
              </Grid.Col>
            </Form.FormGroup>
            {this.renderAuthForm()}
            {this.renderNetworkForm()}
          </Form>
        </Grid>
        <Modal.Footer>
          <Button bsStyle="default" className="btn-cancel" autoFocus={edit} onClick={this.onCancel}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.onSave} disabled={!this.validateForm()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CreateCredentialDialog.propTypes = {
  addCredential: PropTypes.func,
  getCredentials: PropTypes.func,
  getWizardCredentials: PropTypes.func,
  updateCredential: PropTypes.func,
  credential: PropTypes.object,
  credentialType: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  show: PropTypes.bool,
  edit: PropTypes.bool,
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  viewOptions: PropTypes.object
};

CreateCredentialDialog.defaultProps = {
  addCredential: helpers.noop,
  getCredentials: helpers.noop,
  getWizardCredentials: helpers.noop,
  updateCredential: helpers.noop,
  credential: {},
  credentialType: null,
  show: false,
  edit: false,
  fulfilled: false,
  error: false,
  errorMessage: '',
  viewOptions: {}
};

const mapDispatchToProps = dispatch => ({
  getCredentials: queryObj => dispatch(reduxActions.credentials.getCredentials(queryObj)),
  getWizardCredentials: () => dispatch(reduxActions.credentials.getWizardCredentials()),
  addCredential: data => dispatch(reduxActions.credentials.addCredential(data)),
  updateCredential: (id, data) => dispatch(reduxActions.credentials.updateCredential(id, data))
});

const mapStateToProps = state =>
  Object.assign({}, state.credentials.update, {
    viewOptions: state.viewOptions[reduxTypes.view.CREDENTIALS_VIEW]
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCredentialDialog);
