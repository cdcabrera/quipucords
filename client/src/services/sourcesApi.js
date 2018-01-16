import jquery from 'jquery';

class SourcesApi {
  static addSource(data = {}) {
    return fetch(process.env.REACT_APP_SOURCES_API, {
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

  static deleteSource(id) {
    return fetch(`${process.env.REACT_APP_SOURCES_API}${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  static getSource(id) {
    return this.getSources(id);
  }

  static getSources(id = '', query = {}) {
    let queryStr = jquery.param(query);

    return fetch(`${process.env.REACT_APP_SOURCES_API}${id}${queryStr}`).then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }
    );
  }

  static updateSource(id, data = {}) {
    return fetch(`${process.env.REACT_APP_SOURCES_API}${id}`, {
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

export default SourcesApi;
