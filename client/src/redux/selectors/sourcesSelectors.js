import { createSelector } from 'reselect';
import _get from 'lodash/get';
import apiTypes from '../../constants/apiConstants';

/**
 * Map a source object to consumable prop names
 */
const sourceDetail = state => state.addSourceWizard.source;

const sourceDetailSelector = createSelector(
  [sourceDetail],
  source => {
    const updatedSource = {
      credentials: []
    };

    if (source) {
      /**
       * Allow for an edit source with credentials in the form of
       * [{ id:Number, type:String, name:String }]
       * Or an original/edited source in the form of
       * [id]
       */
      updatedSource.credentials = _get(source, apiTypes.API_RESPONSE_SOURCE_CREDENTIALS, []).map(
        cred => cred[apiTypes.API_RESPONSE_SOURCE_CREDENTIALS_ID] || cred
      );

      updatedSource.hosts = source[apiTypes.API_RESPONSE_SOURCE_HOSTS];
      updatedSource.id = source[apiTypes.API_RESPONSE_SOURCE_ID];
      updatedSource.name = source[apiTypes.API_RESPONSE_SOURCE_NAME];

      updatedSource.optionSslCert = _get(
        source[apiTypes.API_RESPONSE_SOURCE_OPTIONS],
        apiTypes.API_RESPONSE_SOURCE_OPTIONS_SSL_CERT,
        false
      );

      updatedSource.optionSslProtocol = _get(
        source[apiTypes.API_RESPONSE_SOURCE_OPTIONS],
        apiTypes.API_RESPONSE_SOURCE_OPTIONS_SSL_PROTOCOL,
        false
      );

      updatedSource.optionDisableSsl = _get(
        source[apiTypes.API_RESPONSE_SOURCE_OPTIONS],
        apiTypes.API_RESPONSE_SOURCE_OPTIONS_DISABLE_SSL,
        false
      );

      updatedSource.optionParmiko = _get(
        source[apiTypes.API_RESPONSE_SOURCE_OPTIONS],
        apiTypes.API_RESPONSE_SOURCE_OPTIONS_PARAMIKO,
        false
      );

      updatedSource.port = source[apiTypes.API_RESPONSE_SOURCE_PORT];
      updatedSource.type = source[apiTypes.API_RESPONSE_SOURCE_SOURCE_TYPE];
    }

    return updatedSource;
  }
);

const makeSourceDetailSelector = () => sourceDetailSelector;

const sourcesSelectors = {
  sourceDetail: sourceDetailSelector,
  makeSourceDetail: makeSourceDetailSelector
};

export { sourcesSelectors as default, sourcesSelectors, sourceDetailSelector, makeSourceDetailSelector };
