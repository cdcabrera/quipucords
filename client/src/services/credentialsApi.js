import jquery from 'jquery';

class CredentialsApi {
  static addCredential(data = {}) {
    return fetch(process.env.REACT_APP_CREDENTIALS_API, {
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

  static deleteCredential(id) {
    return fetch(`${process.env.REACT_APP_CREDENTIALS_API}${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static getCredential(id) {
    return this.getCredentials(id);
  }

  static getCredentials(id = '', query = {}) {
    let queryStr = jquery.param(query);

    return fetch(
      `${process.env.REACT_APP_CREDENTIALS_API}${id}${queryStr}`
    ).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static updateCredential(id, data = {}) {
    return fetch(`${process.env.REACT_APP_CREDENTIALS_API}${id}`, {
      method: 'PUT',
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
}

export default CredentialsApi;
