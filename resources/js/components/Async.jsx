import React from 'react';
import Button from 'react-bootstrap/Button';
import Loading from './Loading';

const Async = ({ loading, error, retry, children }) => {
  if (loading) return <Loading />;

  if (error) {
    const message =
      typeof error === 'string'
        ? `There was an error: ${error}.`
        : 'Something went wrong.';

    return (
      <div>
        {message}{' '}
        {retry && (
          <Button onClick={retry} variant="link" className="align-baseline p-0">
            Retry.
          </Button>
        )}
      </div>
    );
  }

  return children();
};

export default Async;
