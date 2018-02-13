class FactsService {
  constructor(token = {}) {
    this.token = token;
  }

  setHeaders(obj = {}) {
    let tokenObj = {};
    tokenObj[process.env.REACT_APP_AUTH_HEADER] = this.token;

    return new Headers(Object.assign(obj, tokenObj));
  }

  addFacts(data = {}) {
    return fetch(process.env.REACT_APP_FACTS_SERVICE, {
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
}

export default FactsService;
