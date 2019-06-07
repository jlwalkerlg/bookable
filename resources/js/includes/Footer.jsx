import React from 'react';
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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">Books</a>
              </li>
              <li>
                <a href="/">Wishlist</a>
              </li>
              <li>
                <a href="/">Account</a>
              </li>
              <li>
                <a href="/">Contact</a>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <p className="heading left">Categories</p>
            <ul className="list-unstyled">
              <li>
                <a href="/">Philosophy</a>
              </li>
              <li>
                <a href="/">Fiction</a>
              </li>
              <li>
                <a href="/">Science</a>
              </li>
              <li>
                <a href="/">Spirituality</a>
              </li>
              <li>
                <a href="/">Anthropology</a>
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
                <a href="/" className="d-inline-block mr-2">
                  <SocialIcon variant="facebook" width="30" />
                </a>
                <a href="/" className="d-inline-block mr-2">
                  <SocialIcon variant="twitter" width="30" />
                </a>
              </div>
            </address>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
