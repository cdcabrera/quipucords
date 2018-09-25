import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'patternfly-react';
import _omit from 'lodash/omit';
import helpers from '../../common/helpers';

class DropdownSelect extends React.Component {
  state = {
    isOpen: false
  };

  passOnClick = (event, callback) => {
    if (callback) {
      callback.apply(this, event);
    }

    this.toggleDropDown();
  };

  toggleDropDown = (a, b, c) => {
    const { isOpen } = this.state;

    this.setState({
      isOpen: (c && c.source === 'select') || !isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    const { id, title, multiselect, children } = this.props;
    const filteredProps = _omit(this.props, ['multiselect']);

    if (!multiselect) {
      return (
        <Dropdown id={id} {...filteredProps}>
          <Dropdown.Toggle>
            <span>{title}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {children && React.Children.map(children, menuItem => React.cloneElement(menuItem))}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Dropdown id={id} open={isOpen} onToggle={this.toggleDropDown} {...filteredProps}>
        <Dropdown.Toggle>
          <span>{title}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {children &&
            React.Children.map(children, menuItem =>
              React.cloneElement(menuItem, { onClick: e => this.passOnClick(e, menuItem.props.onClick) })
            )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

DropdownSelect.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  multiselect: PropTypes.bool
};

DropdownSelect.defaultProps = {
  id: helpers.generateId(),
  multiselect: false
};

export default DropdownSelect;
