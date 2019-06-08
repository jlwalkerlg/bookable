import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import SocialIcon from '../components/SocialIcon';

const Footer = () => {
  return (
    <footer className="section site-foot">
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <p className="heading left">Menu</p>
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
            <p className="heading left">Categories</p>
            <ul className="list-unstyled">
              <li>
                <Link to="/">Philosophy</Link>
              </li>
              <li>
                <Link to="/">Fiction</Link>
              </li>
              <li>
                <Link to="/">Science</Link>
              </li>
              <li>
                <Link to="/">Spirituality</Link>
              </li>
              <li>
                <Link to="/">Anthropology</Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <p className="heading left">Contact</p>
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

export default Footer;
