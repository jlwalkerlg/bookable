import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => (
  <div className="fullheight d-flex justify-content-center align-items-center">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
    ;
  </div>
);

export default Loading;
