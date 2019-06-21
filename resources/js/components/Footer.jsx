import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import SocialIcon from '../components/SocialIcon';

const Footer = ({ categories }) => {
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
                <Link to="/">Books</Link>
              </li>
              <li>
                <Link to="/">Wishlist</Link>
              </li>
              <li>
                <Link to="/">Account</Link>
              </li>
              <li>
                <Link to="/">Contact</Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <p className="heading heading--left">
              <span>Categories</span>
            </p>
            <ul className="list-unstyled">
              {categories.map((category, index) => (
                <li key={index}>
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
                <Link to="/" className="d-inline-block mr-2">
                  <SocialIcon variant="facebook" width="30" />
                </Link>
                <Link to="/" className="d-inline-block mr-2">
                  <SocialIcon variant="twitter" width="30" />
                </Link>
              </div>
            </address>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps)(Footer);
