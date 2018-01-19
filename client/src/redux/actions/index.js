import * as credentialsActions from './credentialsActions';
import * as factsActions from './factsActions';
import * as reportsActions from './reportsActions';
import * as scansActions from './scansActions';
import * as sourcesActions from './sourcesActions';

const reduxActions = {
  credentials: credentialsActions,
  facts: factsActions,
  reports: reportsActions,
  scans: scansActions,
  sources: sourcesActions
};

export {
  reduxActions,
  credentialsActions,
  factsActions,
  reportsActions,
  scansActions,
  sourcesActions
};

export default reduxActions;
