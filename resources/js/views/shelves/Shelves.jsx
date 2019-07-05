import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import ShelvesListContainer from '../../components/ShelvesListContainer';
import ShelvesItemsContainer from '../../components/ShelvesItemsContainer';

const Shelves = ({ match }) => {
  const { userId, shelfId } = match.params;

  return (
    <div className="section">
      <Container>
        <Row>
          <Col xs={12} lg={3}>
            <ShelvesListContainer userId={userId} />
          </Col>
          <Col xs={12} lg={9} className="mt-3 mt-md-0">
            <h1 className="h5 text-uppercase mb-0 mb-md-3">Books</h1>
            <ShelvesItemsContainer userId={userId} shelfId={shelfId} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Shelves.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      shelfId: PropTypes.string
    }).isRequired
  }).isRequired
};

export default Shelves;
