import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import SocialIcon from '../components/SocialIcon';

const Footer = ({ user, categories }) => {
  return (
    <footer className="section site-foot">
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <p className="heading heading--left">
              <span>Menu</span>
            </p>
            <ul className="list-unstyled">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/books">Books</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              {user.id && (
                <>
                  <li>
                    <Link to="/wishlist">Wishlist</Link>
                  </li>
                  <li>
                    <Link to="/account">Account</Link>
                  </li>
                </>
              )}
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <p className="heading heading--left">
              <span>Categories</span>
            </p>
            <ul className="list-unstyled">
              {categories.map(category => (
                <li key={category.id}>
                  <Link to={`/categories/${category.id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <p className="heading heading--left">
              <span>Contact</span>
            </p>
            <address>
              <p>
                <a href="mailto:info@bookable.com">info@bookable.com</a>
              </p>
              <div>
                <a
                  href="https://facebook.com"
                  target="__blank"
                  className="d-inline-block mr-2"
                >
                  <SocialIcon variant="facebook" width="30" />
                </a>
                <a
                  href="https://twitter.com"
                  target="__blank"
                  className="d-inline-block mr-2"
                >
                  <SocialIcon variant="twitter" width="30" />
                </a>
              </div>
            </address>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="site-foot__small-print">
              <small>* All book and author data from from Goodreads.</small>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  user: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
};

const mapStateToProps = ({ user, categories }) => ({
  user,
  categories,
});

export default connect(mapStateToProps)(Footer);
