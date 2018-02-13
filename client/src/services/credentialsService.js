import jquery from 'jquery';

class CredentialsService {
  constructor(token = {}) {
    this.token = token;
  }

  setHeaders(obj = {}) {
    let tokenObj = {};
    tokenObj[process.env.REACT_APP_AUTH_HEADER] = this.token;

    return new Headers(Object.assign(obj, tokenObj));
  }

  addCredential(data = {}) {
    return fetch(process.env.REACT_APP_CREDENTIALS_SERVICE, {
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

  deleteCredential(id) {
    return fetch(`${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}`, {
      method: 'DELETE',
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

  deleteCredentials(data = []) {
    return Promise.all.apply(this, data.map(id => this.deleteCredential(id)));
  }

  getCredential(id) {
    return this.getCredentials(id);
  }

  getCredentials(id = '', query = {}) {
    let queryStr = jquery.param(query);

    if (queryStr.length) {
      queryStr = `?${queryStr}`;
    }

    return fetch(
      `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}${queryStr}`,
      {
        credentials: 'same-origin',
        headers: this.setHeaders()
      }
    ).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  updateCredential(id, data = {}) {
    return fetch(`${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}`, {
      method: 'PUT',
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
}

export default CredentialsService;
