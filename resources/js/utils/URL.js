class Query {
  constructor(queryString) {
    // Trim whitespace.
    queryString = queryString.trim();
    // Strip question mark from beginning.
    this.queryString =
      queryString[0] === '?' ? queryString.slice(1) : queryString;
    // Split into params.
    this.params = {};
    this.queryString.split('&').forEach(param => {
      const [name, value] = param.split('=');
      if (name) {
        this.params[name] = value;
      }
    });
  }

  getParam(param) {
    return this.params[param];
  }
}

class URL {
  query(queryString) {
    return new Query(queryString);
  }
}

export default new URL();
