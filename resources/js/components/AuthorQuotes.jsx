import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import SlickArrow from './SlickArrow';
import { Container } from 'react-bootstrap';
import sanitize from '../utils/sanitize';
import Loading from './Loading';

const slickOptions = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SlickArrow direction="right" />,
  prevArrow: <SlickArrow direction="left" />
};

const AuthorQuotes = ({ quotes, author, isLoading, error }) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <article className="section bg-beige text-center">
      <Container>
        <h2 className="heading mb-4">
          <span>Quotes by {author.name}</span>
        </h2>
        <div className="px-4">
          <Slider {...slickOptions}>
            {quotes.map(quote => (
              <div key={quote.id}>
                <div
                  className="quote mx-4"
                  dangerouslySetInnerHTML={sanitize.markup(quote.quote)}
                />
              </div>
            ))}
            <div>
              <Link
                to={`/authors/${author.id}/quotes`}
                className="btn btn-warning rounded-pill"
              >
                Read More Quotes
              </Link>
            </div>
          </Slider>
        </div>
      </Container>
    </article>
  );
};

AuthorQuotes.propTypes = {
  quotes: PropTypes.array.isRequired,
  author: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object
};

export default AuthorQuotes;
