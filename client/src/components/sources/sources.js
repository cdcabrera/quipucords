import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Alert, Button, EmptyState, ListView, Modal } from 'patternfly-react';

import reduxActions from '../../redux/actions';
import reduxTypes from '../../redux/constants';
import Store from '../../redux/store';
import helpers from '../../common/helpers';

import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';

import SourcesEmptyState from './sourcesEmptyState';
import SourceListItem from './sourceListItem';
import CreateScanDialog from './createScanDialog';
import { SourceFilterFields, SourceSortFields } from './sourceConstants';

class Sources extends React.Component {
  static notifyDeleteStatus(item, error, results) {
    try {
      if (error) {
        Store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: 'error',
          header: 'Error',
          message: helpers.getErrorMessageFromResults(results)
        });
      } else {
        Store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: 'success',
          message: (
            <span>
              Deleted source <strong>{_.get(item, 'name')}</strong>.
            </span>
          )
        });

        Store.dispatch({
          type: reduxTypes.view.DESELECT_ITEM,
          viewType: reduxTypes.view.SOURCES_VIEW,
          item
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  state = {
    scanDialogShown: false,
    multiSourceScan: false,
    currentScanSource: null,
    lastRefresh: null
  };

  componentDidMount() {
    this.onRefresh();
  }

  // FixMe: convert componentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    const { viewOptions, updated, deleted, fulfilled } = this.props;

    // Check for changes resulting in a fetch
    if (helpers.viewPropsChanged(nextProps.viewOptions, viewOptions)) {
      this.onRefresh(nextProps);
    }

    if ((nextProps.updated && !updated) || (nextProps.deleted && !deleted)) {
      this.onRefresh();
    }

    if (nextProps.fulfilled && !fulfilled) {
      this.setState({ lastRefresh: Date.now() });
    }
  }

  onScanSource = source => {
    this.setState({
      scanDialogShown: true,
      multiSourceScan: false,
      currentScanSource: source
    });
  };

  onScanSources = () => {
    this.setState({ scanDialogShown: true, multiSourceScan: true });
  };

  onHideScanDialog = updated => {
    this.setState({ scanDialogShown: false });

    if (updated) {
      this.onRefresh();
    }
  };

  onRefresh = props => {
    const { getSources, viewOptions } = this.props;
    const options = _.get(props, 'viewOptions') || viewOptions;
    getSources(helpers.createViewQueryObject(options));
  };

  onClearFilters = () => {
    Store.dispatch({
      type: reduxTypes.viewToolbar.CLEAR_FILTERS,
      viewType: reduxTypes.view.SOURCES_VIEW
    });
  };

  onEditSource = item => {
    Store.dispatch({
      type: reduxTypes.sources.EDIT_SOURCE_SHOW,
      source: item
    });
  };

  onShowAddSourceWizard = () => {
    Store.dispatch({
      type: reduxTypes.sources.CREATE_SOURCE_SHOW
    });
  };

  onHandleDeleteSource = item => {
    const heading = (
      <span>
        Are you sure you want to delete the source <strong>{item.name}</strong>?
      </span>
    );

    const onConfirm = () => this.doDeleteSource(item);

    Store.dispatch({
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
      title: 'Delete Source',
      heading,
      confirmButtonText: 'Delete',
      onConfirm
    });
  };

  doDeleteSource(item) {
    const { deleteSource } = this.props;

    Store.dispatch({
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
    });

    deleteSource(item.id).then(
      response => Sources.notifyDeleteStatus(item, false, response.value),
      error => Sources.notifyDeleteStatus(item, true, error)
    );
  }

  renderSourceActions() {
    const { viewOptions } = this.props;

    return (
      <div className="form-group">
        <Button bsStyle="primary" onClick={this.onShowAddSourceWizard}>
          Add
        </Button>
        <Button
          disabled={!viewOptions.selectedItems || viewOptions.selectedItems.length === 0}
          onClick={this.onScanSources}
        >
          Scan
        </Button>
      </div>
    );
  }

  renderPendingMessage() {
    const { pending } = this.props;

    if (pending) {
      return (
        <Modal bsSize="lg" backdrop={false} show animation={false}>
          <Modal.Body>
            <div className="spinner spinner-xl" />
            <div className="text-center">Loading sources...</div>
          </Modal.Body>
        </Modal>
      );
    }

    return null;
  }

  renderSourcesList(items) {
    const { lastRefresh } = this.state;

    if (_.size(items)) {
      return (
        <ListView className="quipicords-list-view">
          {items.map(item => (
            <SourceListItem
              item={item}
              lastRefresh={lastRefresh}
              onEdit={this.onEditSource}
              onDelete={this.onHandleDeleteSource}
              onScan={this.onScanSource}
            />
          ))}
        </ListView>
      );
    }

    return (
      <EmptyState className="list-view-blank-slate">
        <EmptyState.Title>No Results Match the Filter Criteria</EmptyState.Title>
        <EmptyState.Info>The active filters are hiding all items.</EmptyState.Info>
        <EmptyState.Action>
          <Button bsStyle="link" onClick={this.onClearFilters}>
            Clear Filters
          </Button>
        </EmptyState.Action>
      </EmptyState>
    );
  }

  render() {
    const { error, errorMessage, sources, viewOptions } = this.props;
    const { scanDialogShown, multiSourceScan, currentScanSource, lastRefresh } = this.state;

    if (error) {
      return (
        <EmptyState>
          <Alert type="error">
            <span>Error retrieving sources: {errorMessage}</span>
          </Alert>
          {this.renderPendingMessage()}
        </EmptyState>
      );
    }

    if (_.size(sources) || _.size(viewOptions.activeFilters)) {
      return (
        <React.Fragment>
          <div className="quipucords-view-container">
            <ViewToolbar
              viewType={reduxTypes.view.SOURCES_VIEW}
              filterFields={SourceFilterFields}
              sortFields={SourceSortFields}
              onRefresh={this.onRefresh}
              lastRefresh={lastRefresh}
              actions={this.renderSourceActions()}
              itemsType="Source"
              itemsTypePlural="Sources"
              selectedCount={viewOptions.selectedItems.length}
              {...viewOptions}
            />
            <ViewPaginationRow viewType={reduxTypes.view.SOURCES_VIEW} {...viewOptions} />
            <div className="quipucords-list-container">{this.renderSourcesList(sources)}</div>
          </div>
          {this.renderPendingMessage()}
          <CreateScanDialog
            show={scanDialogShown}
            sources={multiSourceScan ? viewOptions.selectedItems : [currentScanSource]}
            onClose={this.onHideScanDialog}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <SourcesEmptyState onAddSource={this.onShowAddSourceWizard} />
        {this.renderPendingMessage()}
      </React.Fragment>
    );
  }
}

Sources.propTypes = {
  getSources: PropTypes.func,
  deleteSource: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  pending: PropTypes.bool,
  sources: PropTypes.array,
  lastRefresh: PropTypes.object,
  viewOptions: PropTypes.object,
  fulfilled: PropTypes.bool,
  updated: PropTypes.bool,
  deleted: PropTypes.bool
};

Sources.defaultProps = {
  getSources: helpers.noop,
  deleteSource: helpers.noop,
  error: false,
  errorMessage: '',
  pending: false,
  sources: [],
  lastRefresh: {},
  viewOptions: {},
  fulfilled: false,
  updated: false,
  deleted: false
};

const mapDispatchToProps = dispatch => ({
  getSources: queryObj => dispatch(reduxActions.sources.getSources(queryObj)),
  deleteSource: id => dispatch(reduxActions.sources.deleteSource(id))
});

const mapStateToProps = state =>
  Object.assign(
    {},
    state.sources.view,
    { viewOptions: state.viewOptions[reduxTypes.view.SOURCES_VIEW] },
    { updated: state.addSourceWizard.view.fulfilled },
    { deleted: state.sources.update.fulfilled }
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sources);
