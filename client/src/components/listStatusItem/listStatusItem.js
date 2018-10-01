import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon, ListView } from 'patternfly-react';
import _get from 'lodash/get';
import helpers from '../../common/helpers';
import SimpleTooltip from '../simpleTooltIp/simpleTooltip';

const ListStatusItem = ({
  id,
  count,
  emptyText,
  tipSingular,
  tipPlural,
  expanded,
  expandType,
  toggleExpand,
  iconInfo
}) => {
  const renderExpandContent = (iconInfoDisplay, countDisplay, text) => {
    if (iconInfoDisplay) {
      const classes = cx('list-view-compound-item-icon', ..._get(iconInfoDisplay, 'classNames', []));
      return (
        <React.Fragment>
          <Icon className={classes} type={iconInfoDisplay.type} name={iconInfoDisplay.name || 'unknown'} />
          <strong>{countDisplay}</strong>
        </React.Fragment>
      );
    }

    return (
      <span>
        <strong>{countDisplay}</strong>
        {` ${text}`}
      </span>
    );
  };

  if (count > 0) {
    return (
      <ListView.InfoItem className="list-view-info-item-icon-count">
        <SimpleTooltip id={`${id}_tip`} tooltip={`${count}  ${count === 1 ? tipSingular : tipPlural}`}>
          <ListView.Expand
            expanded={expanded}
            toggleExpanded={() => {
              toggleExpand(expandType);
            }}
          >
            {renderExpandContent(iconInfo, count, tipPlural)}
          </ListView.Expand>
        </SimpleTooltip>
      </ListView.InfoItem>
    );
  }

  return (
    <ListView.InfoItem className="list-view-info-item-icon-count empty-count">
      <SimpleTooltip id={`${id}_tip`} tooltip={`0 ${tipPlural}`}>
        <span>{emptyText}</span>
      </SimpleTooltip>
    </ListView.InfoItem>
  );
};

ListStatusItem.propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  emptyText: PropTypes.string,
  tipSingular: PropTypes.string,
  tipPlural: PropTypes.string,
  expanded: PropTypes.bool,
  expandType: PropTypes.string,
  toggleExpand: PropTypes.func,
  iconInfo: PropTypes.object
};

ListStatusItem.defaultProps = {
  id: null,
  count: 0,
  emptyText: '',
  tipSingular: '',
  tipPlural: '',
  expanded: false,
  expandType: null,
  toggleExpand: helpers.noop,
  iconInfo: {}
};

export default ListStatusItem;
