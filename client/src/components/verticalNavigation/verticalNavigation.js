import ClassNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import _ from 'lodash';
import { OverlayTrigger, Tooltip } from 'patternfly-react';

class VerticalNavigation extends React.Component {
  renderMenuItems() {
    return this.props.menuItems.map((item, index) => {
      let icon = null;
      if (item.iconClass !== undefined) {
        if (this.props.navigationBar.collapsed) {
          let tooltip = (
            <Tooltip id="tooltip" className="nav-pf-vertical-tooltip">
              <div>{item.title}</div>
            </Tooltip>
          );
          icon = (
            <OverlayTrigger overlay={tooltip} placement="top">
              <span className={item.iconClass} key={item.iconClass} title="" />
            </OverlayTrigger>
          );
        } else {
          icon = (
            <span className={item.iconClass} key={item.iconClass} title="" />
          );
        }
      }

      let classes = ClassNames({
        'list-group-item': true,
        active: _.startsWith(this.props.location.pathname, item.href)
      });

      return (
        <li className={classes} key={item.title}>
          <Link to={item.href}>
            {icon}
            <span className="list-group-item-value">{item.title}</span>
          </Link>
        </li>
      );
    });
  }

  render() {
    let classes = ClassNames({
      'nav-pf-vertical': true,
      'nav-pf-vertical-with-sub-menus': true,
      collapsed: this.props.navigationBar.collapsed
    });

    return (
      <div className={classes}>
        <ul className="list-group">{this.renderMenuItems()}</ul>
      </div>
    );
  }
}

VerticalNavigation.propTypes = {
  location: PropTypes.object,
  menuItems: PropTypes.array.isRequired,
  navigationBar: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return state;
}

export default withRouter(connect(mapStateToProps)(VerticalNavigation));
