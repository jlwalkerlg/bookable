import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import Slider from 'react-slick';
import { getBooks } from '../actions/books';
import SlickArrow from '../components/SlickArrow';

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
      nextArrow: <SlickArrow direction="right" />,
      prevArrow: <SlickArrow direction="left" />,
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
      <main>
        <Container>
          <h1>Dashboard!</h1>
          <Slider {...settings}>
            {books.map((book, index) => (
              <div key={index}>{book.title}</div>
            ))}
          </Slider>
        </Container>
      </main>
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
