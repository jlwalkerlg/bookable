import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import Slider from 'react-slick';
import { getBooks } from '../actions/books';
import Cheveron from '../components/icons/Cheveron';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getBooks();
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      swipeToSlide: true,
      nextArrow: <Cheveron direction="right" />,
      prevArrow: <Cheveron direction="left" />,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    const { books } = this.props;

    return (
      <Container>
        <h1>Dashboard!</h1>
        <Slider {...settings}>
          {books.map((book, index) => (
            <div key={index}>{book.title}</div>
          ))}
        </Slider>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  books: state.books
});

const mapDispatchToProps = {
  getBooks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
