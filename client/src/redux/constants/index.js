import * as aboutActionTypes from './aboutConstants';
import * as credentialsActionTypes from './credentialsConstants';
import * as factsActionTypes from './factsConstants';
import * as navigationBarActionTypes from './navigationBarConstants';
import * as reportsActionTypes from './reportsConstants';
import * as scansActionTypes from './scansConstants';
import * as sourcesActionTypes from './sourcesConstants';
import * as viewToolbarActionTypes from './viewToolbarConstants';

const reduxActionTypes = {
  about: aboutActionTypes,
  credentials: credentialsActionTypes,
  facts: factsActionTypes,
  navigation: navigationBarActionTypes,
  reports: reportsActionTypes,
  scans: scansActionTypes,
  sources: sourcesActionTypes,
  viewToolbar: viewToolbarActionTypes
};

export {
  reduxActionTypes,
  aboutActionTypes,
  credentialsActionTypes,
  factsActionTypes,
  navigationBarActionTypes,
  reportsActionTypes,
  scansActionTypes,
  sourcesActionTypes,
  viewToolbarActionTypes
};
