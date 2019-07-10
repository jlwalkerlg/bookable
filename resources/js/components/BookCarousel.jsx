import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import SlickArrow from './SlickArrow';

const slickOptions = {
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  nextArrow: <SlickArrow direction="right" />,
  prevArrow: <SlickArrow direction="left" />,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      }
    }
  ]
};

const BookCarousel = ({ books, jagged, cardClassName }) => {
  if (books.length < 5)
    return (
      <div className="d-flex justify-content-center flex-wrap">
        {books.map(book => (
          <ProductCard key={book.id} book={book} className="mx-3" />
        ))}
      </div>
    );

  return (
    <Slider {...slickOptions} className="text-center">
      {books.map((book, index) => {
        const cardClass =
          (cardClassName || '') + (jagged && index % 2 !== 0 ? ' mt-lg-4' : '');

        return <ProductCard key={book.id} book={book} className={cardClass} />;
      })}
    </Slider>
  );
};

BookCarousel.propTypes = {
  books: PropTypes.array.isRequired,
  jagged: PropTypes.bool,
  cardClassName: PropTypes.string
};

export default BookCarousel;
