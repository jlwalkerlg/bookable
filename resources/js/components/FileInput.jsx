import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
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

    return (
      <div className="file-group">
        <div className={`file-value${!value ? ' file-value--empty' : ''}`}>
          {value || 'Choose a file...'}
        </div>
        <Form.Control
          type="file"
          name={this.props.name}
          className="file-input"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default FileInput;
