import jquery from 'jquery';

class ScansService {
  constructor(token = {}) {
    this.token = token;
  }

  setHeaders(obj = {}) {
    let tokenObj = {};
    tokenObj[process.env.REACT_APP_AUTH_HEADER] = this.token;

    return new Headers(Object.assign(obj, tokenObj));
  }

  addScan(data = {}) {
    return fetch(process.env.REACT_APP_SCANS_SERVICE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: this.setHeaders({
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

  cancelScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_CANCEL.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: this.setHeaders()
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  getScan(id) {
    return this.getScans(id);
  }

  getScans(id = '', query = {}) {
    let queryStr = jquery.param(query);

    if (queryStr.length) {
      queryStr = `?${queryStr}`;
    }

    return fetch(`${process.env.REACT_APP_SCANS_SERVICE}${id}${queryStr}`, {
      credentials: 'same-origin',
      headers: this.setHeaders()
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  getScanResults(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_RESULTS.replace(
      '{0}',
      id
    );

    return fetch(apiPath, { credentials: 'same-origin', headers: this.setHeaders() }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  pauseScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_PAUSE.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: this.setHeaders()
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  restartScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_SERVICE_RESTART.replace(
      '{0}',
      id
    );

    return fetch(apiPath, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: this.setHeaders()
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
