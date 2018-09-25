import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'patternfly-react';
import * as moment from 'moment';

class RefreshTimeButton extends React.Component {
  constructor(props) {
    super(props);

    this.pollingInterval = null;
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  // FixMe: convert componentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    if (nextProps.lastRefresh && !this.lastRefresh) {
      this.startPolling();
    }
  }

  componentWillUnmount() {
    this.stopPolling();
    this.mounted = false;
  }

  doUpdate = () => {
    this.forceUpdate();
  };

  startPolling() {
    if (!this.pollingInterval && this.mounted) {
      this.pollingInterval = setInterval(this.doUpdate, 3000);
    }
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  render() {
    const { lastRefresh, onRefresh } = this.props;

    return (
      <Button onClick={onRefresh} bsStyle="link" className="refresh-button">
        <Icon type="fa" name="refresh" />
        <span className="last-refresh-time">
          Refreshed{' '}
          {lastRefresh &&
            moment
              .utc(lastRefresh)
              .utcOffset(moment().utcOffset())
              .fromNow()}
        </span>
      </Button>
    );
  }
}

RefreshTimeButton.propTypes = {
  lastRefresh: PropTypes.number,
  onRefresh: PropTypes.func.isRequired
};

RefreshTimeButton.defaultProps = {
  lastRefresh: null
};

export default RefreshTimeButton;
