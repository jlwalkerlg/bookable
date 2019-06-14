import createDOMPurify from 'dompurify';

class Sanitize {
  constructor() {
    this.DOMPurify = createDOMPurify(window);
  }

  sanitize(dirty) {
    return this.DOMPurify.sanitize(dirty);
  }

  markup(dirty) {
    return { __html: this.sanitize(dirty) };
  }
}

export default new Sanitize();
