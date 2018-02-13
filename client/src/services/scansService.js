import jquery from 'jquery';

class ScansService {
  static addScan(data = {}) {
    return fetch(process.env.REACT_APP_SCANS_SERVICE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static cancelScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_CANCEL.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static getScan(id) {
    return this.getScans(id);
  }

  static getScans(id = '', query = {}) {
    let queryStr = jquery.param(query);

    if (queryStr.length) {
      queryStr = `?${queryStr}`;
    }

    return fetch(`${process.env.REACT_APP_SCANS_SERVICE}${id}${queryStr}`, {
      credentials: 'same-origin'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static getScanResults(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_RESULTS.replace(
      '{0}',
      id
    );

    return fetch(apiPath, { credentials: 'same-origin' }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static pauseScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_PAUSE.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static restartScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_RESTART.replace(
      '{0}',
      id
    );

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }
}

export default ScansService;
