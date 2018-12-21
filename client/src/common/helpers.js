import _ from 'lodash';

const devModeNormalizeCount = (count, modulus = 100) => Math.abs(count) % modulus;

const generateId = prefix => `${prefix || 'generatedid'}-${Math.ceil(1e5 * Math.random())}`;

const noop = Function.prototype;

const sourceTypeString = sourceType => {
  switch (sourceType) {
    case 'vcenter':
      return 'VCenter';
    case 'network':
      return 'Network';
    case 'satellite':
      return 'Satellite';
    default:
      return '';
  }
};

const sourceTypeIcon = sourceType => {
  switch (sourceType) {
    case 'vcenter':
      return { type: 'pf', name: 'vcenter' };
    case 'network':
      return { type: 'pf', name: 'network-range' };
    case 'satellite':
      return { type: 'pf', name: 'satellite' };
    default:
      return { type: 'pf', name: '' };
  }
};

const scanTypeString = scanType => {
  switch (scanType) {
    case 'connect':
      return 'Connection Scan';
    case 'inspect':
      return 'Inspection Scan';
    default:
      return '';
  }
};

const scanTypeIcon = scanType => {
  switch (scanType) {
    case 'connect':
      return { type: 'pf', name: 'connected' };
    case 'inspect':
      return { type: 'fa', name: 'search' };
    default:
      return { type: 'pf', name: '' };
  }
};

const scanStatusString = scanStatus => {
  switch (scanStatus) {
    case 'success':
      return 'Successful';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'created':
      return 'Created';
    case 'running':
      return 'Running';
    case 'paused':
      return 'Paused';
    case 'pending':
      return 'Pending';
    case 'canceled':
      return 'Canceled';
    default:
      console.error(`Unknown status: ${scanStatus}`);
      return '';
  }
};

const scanStatusIcon = scanStatus => {
  switch (scanStatus) {
    case 'completed':
    case 'success':
      return { type: 'pf', name: 'ok', classNames: [] };
    case 'failed':
    case 'canceled':
      return { type: 'pf', name: 'error-circle-o', classNames: [] };
    case 'unreachable':
      return { type: 'pf', name: 'disconnected', classNames: ['is-error'] };
    case 'created':
    case 'pending':
    case 'running':
      return { type: 'fa', name: 'spinner', classNames: ['fa-spin'] };
    case 'paused':
      return { type: 'pf', name: 'warning-triangle-o', classNames: [] };
    default:
      console.error(`Unknown status: ${scanStatus}`);
      return { type: 'pf', name: 'unknown', classNames: [] };
  }
};

const authorizationTypeString = authorizationType => {
  switch (authorizationType) {
    case 'usernamePassword':
      return 'Username and Password';
    case 'sshKey':
      return 'SSH Key';
    default:
      return '';
  }
};

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  let obj = { ...state };

  if (prop && !state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (reset && prop && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset && prop) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data
    };
  } else if (reset && !prop) {
    obj = {
      ...state,
      ...initialState,
      ...data
    };
  } else if (prop) {
    obj[prop] = {
      ...state[prop],
      ...data
    };
  } else {
    obj = {
      ...state,
      ...data
    };
  }

  return obj;
};

const viewPropsChanged = (nextViewOptions, currentViewOptions) =>
  nextViewOptions.currentPage !== currentViewOptions.currentPage ||
  nextViewOptions.pageSize !== currentViewOptions.pageSize ||
  nextViewOptions.sortField !== currentViewOptions.sortField ||
  nextViewOptions.sortAscending !== currentViewOptions.sortAscending ||
  nextViewOptions.activeFilters !== currentViewOptions.activeFilters;

const createViewQueryObject = (viewOptions, queryObj) => {
  const queryObject = {
    ...queryObj
  };

  if (viewOptions) {
    if (viewOptions.sortField) {
      queryObject.ordering = viewOptions.sortAscending ? viewOptions.sortField : `-${viewOptions.sortField}`;
    }

    if (viewOptions.activeFilters) {
      viewOptions.activeFilters.forEach(filter => {
        queryObject[filter.field.id] = filter.field.filterType === 'select' ? filter.value.id : filter.value;
      });
    }

    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;
  }

  return queryObject;
};

const getMessageFromResults = (results, filterField = null) => {
  const status = _.get(results, 'response.status', results.status);
  const statusResponse = _.get(results, 'response.statusText', results.statusText);
  const messageResponse = _.get(results, 'response.data', results.message);
  const detailResponse = _.get(results, 'response.data', results.detail);

  let serverStatus = '';

  if (status < 400 && !messageResponse && !detailResponse) {
    return statusResponse;
  }

  if ((status >= 500 || status === undefined) && !messageResponse && !detailResponse) {
    return `${status || ''} Server is currently unable to handle this request.`;
  }

  if (status >= 500 && /Request\sURL:/.test(messageResponse)) {
    return `${status} ${messageResponse.split(/Request\sURL:/)[0]}`;
  }

  if (status >= 500 || status === undefined) {
    serverStatus = status ? `${status} ` : '';
  }

  if (typeof messageResponse === 'string') {
    return `${serverStatus}${messageResponse}`;
  }

  if (typeof detailResponse === 'string') {
    return `${serverStatus}${detailResponse}`;
  }

  const getMessages = (messageObject, filterKey) => {
    const obj = filterKey ? messageObject[filterKey] : messageObject;

    return _.map(
      obj,
      next => {
        if (_.isArray(next)) {
          return getMessages(next);
        }

        return next;
      },
      null
    );
  };

  return `${serverStatus}${_.join(getMessages(messageResponse || detailResponse, filterField), '\n')}`;
};

const getStatusFromResults = results => {
  let status = _.get(results, 'response.status', results.status);

  if (status === undefined) {
    status = 0;
  }

  return status;
};

const isIpAddress = name => {
  const vals = name.split('.');
  if (vals.length === 4) {
    return _.find(vals, val => Number.isNaN(val)) === undefined;
  }
  return false;
};

const ipAddressValue = name => {
  const values = name.split('.');
  return values[0] * 0x1000000 + values[1] * 0x10000 + values[2] * 0x100 + values[3] * 1;
};

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const RH_BRAND = process.env.REACT_APP_RH_BRAND === 'true';

const FULFILLED_ACTION = base => `${base}_FULFILLED`;

const PENDING_ACTION = base => `${base}_PENDING`;

const REJECTED_ACTION = base => `${base}_REJECTED`;

const HTTP_STATUS_RANGE = status => `${status}_STATUS_RANGE`;

export const helpers = {
  devModeNormalizeCount,
  generateId,
  noop,
  sourceTypeString,
  sourceTypeIcon,
  scanTypeString,
  scanStatusString,
  scanTypeIcon,
  scanStatusIcon,
  authorizationTypeString,
  setStateProp,
  viewPropsChanged,
  createViewQueryObject,
  getMessageFromResults,
  getStatusFromResults,
  isIpAddress,
  ipAddressValue,
  DEV_MODE,
  TEST_MODE,
  RH_BRAND,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  HTTP_STATUS_RANGE
};

export default helpers;
