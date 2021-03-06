import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import path from '../utils/path';

class FileInput extends Component {
  state = {
    value: ''
  };

  handleChange = e => {
    const value = e.target.value && path.basepath(e.target.value);
    this.setState({ value });
    if (this.props.onChange) this.props.onChange(e);
  };

  render() {
    const { value } = this.state;
    const { file, validationError } = this.props;

    return (
      <div className="file-group">
        <div
          className={`file-value${file && value ? '' : ' file-value--empty'}`}
        >
          {(file && value) || 'Choose a file...'}
        </div>
        <Form.Control
          type="file"
          name={this.props.name}
          className="file-input"
          onChange={this.handleChange}
          isInvalid={!!validationError}
        />
        <Form.Control.Feedback type="invalid">
          {validationError}
        </Form.Control.Feedback>
      </div>
    );
  }
}

export default FileInput;
