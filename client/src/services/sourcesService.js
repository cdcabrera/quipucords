import jquery from 'jquery';

class SourcesService {
  constructor(token = {}) {
    this.token = token;
  }

  setHeaders(obj = {}) {
    let tokenObj = {};
    tokenObj[process.env.REACT_APP_AUTH_HEADER] = this.token;

    return new Headers(Object.assign(obj, tokenObj));
  }

  addSource(data = {}) {
    return fetch(process.env.REACT_APP_SOURCES_SERVICE, {
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

  deleteSource(id) {
    return fetch(`${process.env.REACT_APP_SOURCES_SERVICE}${id}`, {
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

  deleteSources(data = []) {
    return Promise.all.apply(this, data.map(id => this.deleteSource(id)));
  }

  getSource(id) {
    return this.getSources(id);
  }

  getSources(id = '', query = {}) {
    let queryStr = jquery.param(query);

    if (queryStr.length) {
      queryStr = `?${queryStr}`;
    }

    return fetch(`${process.env.REACT_APP_SOURCES_SERVICE}${id}${queryStr}`, {
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

  updateSource(id, data = {}) {
    return fetch(`${process.env.REACT_APP_SOURCES_SERVICE}${id}`, {
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

export default SourcesService;
