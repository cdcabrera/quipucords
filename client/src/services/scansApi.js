import jquery from 'jquery';

class ScansApi {
  static addScan(data = {}) {
    return fetch(process.env.REACT_APP_SCANS_API, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static cancelScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_API_CANCEL.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static getScans(id = '', query = {}) {
    let queryStr = jquery.param(query);

    return fetch(`${process.env.REACT_APP_SCANS_API}${id}${queryStr}`).then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }
    );
  }

  static getScanResults(id) {
    let apiPath = process.env.REACT_APP_SCANS_API_RESULTS.replace('{0}', id);

    return fetch(apiPath).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static pauseScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_API_PAUSE.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static restartScan(id) {
    let apiPath = process.env.REACT_APP_SCANS_API_RESTART.replace('{0}', id);

    return fetch(apiPath, {
      method: 'PUT'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }
}

export default ScansApi;
