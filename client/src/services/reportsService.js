import jquery from 'jquery';

class ReportsService {
  constructor(token = {}) {
    this.token = token;
  }

  setHeaders(obj = {}) {
    let tokenObj = {};
    tokenObj[process.env.REACT_APP_AUTH_HEADER] = this.token;

    return new Headers(Object.assign(obj, tokenObj));
  }

  getReports(query = {}) {
    let queryStr = jquery.param(query);

    if (queryStr.length) {
      queryStr = `?${queryStr}`;
    }

    return fetch(`${process.env.REACT_APP_REPORTS_SERVICE}${queryStr}`, {
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

export default ReportsService;
