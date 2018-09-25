import React from 'react';
import PropTypes from 'prop-types';
import { ToastNotificationList, TimedToastNotification } from 'patternfly-react';
import { connect } from 'react-redux';
import Store from '../../redux/store';
import reduxTypes from '../../redux/constants';
import helpers from '../../common/helpers';

class ToastNotificationsList extends React.Component {
  onHover = () => {
    Store.dispatch({ type: reduxTypes.toastNotifications.TOAST_PAUSE });
  };

  onLeave = () => {
    Store.dispatch({ type: reduxTypes.toastNotifications.TOAST_RESUME });
  };

  onDismiss = toast => {
    Store.dispatch({
      type: reduxTypes.toastNotifications.TOAST_REMOVE,
      toast
    });
  };

  render() {
    const { toasts, paused } = this.props;

    return (
      <ToastNotificationList>
        {toasts &&
          toasts.map((toast, index) => {
            if (!toast.removed) {
              return (
                <TimedToastNotification
                  key={helpers.generateKey(toast)}
                  toastIndex={index}
                  type={toast.alertType}
                  paused={paused}
                  onDismiss={() => this.onDismiss(toast)}
                  onMouseEnter={this.onHover}
                  onMouseLeave={this.onLeave}
                >
                  <span>
                    <strong>{toast.header}</strong> &nbsp;
                    {toast.message}
                  </span>
                </TimedToastNotification>
              );
            }

            return null;
          })}
      </ToastNotificationList>
    );
  }
}

ToastNotificationsList.propTypes = {
  toasts: PropTypes.array,
  paused: PropTypes.bool
};

ToastNotificationsList.defaultProps = {
  toasts: [],
  paused: false
};

const mapStateToProps = state => ({ ...state.toastNotifications });

export default connect(mapStateToProps)(ToastNotificationsList);
