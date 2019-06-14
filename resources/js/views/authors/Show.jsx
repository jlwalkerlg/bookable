import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import TempProductCard from '../../components/TempProductCard';
import SlickArrow from '../../components/SlickArrow';

const slickOptions = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SlickArrow direction="right" />,
  prevArrow: <SlickArrow direction="left" />
};

const Show = () => {
  return (
    <main>
      {/* Header */}
      <header className="section bg-beige text-center">
        <Container>
          <Row>
            <Col xs={12} md={6} className="text-md-right mb-3 mb-md-0">
              <img
                src="https://images.gr-assets.com/authors/1189120061p7/4.jpg"
                alt="Douglas Adams"
              />
            </Col>
            <Col xs={12} md={6} className="text-md-left">
              <h1 className="font-display">Douglas Adams</h1>
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Born:</span> 03 Nov 1952
              </p>
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Died:</span> 05 Nov 2001
              </p>
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Hometown:</span> Cambridge,
                England
              </p>
              <p className="mb-1 font-size-7">
                <span className="font-weight-bold">Average rating:</span> 4.32
              </p>
              <p className="font-size-7">
                <span className="font-weight-bold">Number of ratings:</span>{' '}
                1314341242
              </p>
              <p className="text-description text-justify text-md-left">
                Douglas Noël Adams was an English author, comic radio dramatist,
                and musician. He is best known as the author of the{' '}
                <i>
                  <a
                    href="https://www.goodreads.com/book/show/11.Hitchhiker_s_Guide_to_the_Galaxy"
                    title="Hitchhiker's Guide to the Galaxy"
                    rel="nofollow"
                  >
                    Hitchhiker's Guide to the Galaxy
                  </a>
                </i>{' '}
                series. Hitchhiker's began on radio, and developed into a
                "trilogy" of five books (which sold more than fifteen million
                copies during his lifetime) as well as a television series, a
                comic book series, a computer game, and a feature film that was
                completed after Adams' death. The series has also been adapted
                for live theatre using various scripts; the earliest such
                productions used material newly written by Adams. He was known
                to some fans as Bop Ad (after his illegible signature), or by
                his initials "DNA".
                <br />
                <br />
                In addition to <i>The Hitchhiker's Guide to the Galaxy</i>,
                Douglas Adams wrote or co-wrote three stories of the science
                fiction television series Doctor Who and served as Script Editor
                during the seventeenth season. His other written works include
                the Dirk Gently novels, and he co-wrote two Liff books and{' '}
                <i>Last Chance to See</i>, itself based on a radio series. Adams
                also originated the idea for the computer game{' '}
                <i>Starship Titanic</i>, which was produced by a company that
                Adams co-founded, and adapted into a novel by Terry Jones. A
                posthumous collection of essays and other material, including an
                incomplete novel, was published as{' '}
                <i>
                  <a
                    href="https://www.goodreads.com/book/show/359.The_Salmon_of_Doubt"
                    title="The Salmon of Doubt"
                    rel="nofollow"
                  >
                    The Salmon of Doubt
                  </a>
                </i>{' '}
                in 2002.
                <br />
                <br />
                His fans and friends also knew Adams as an environmental
                activist and a lover of fast cars, cameras, the Macintosh
                computer, and other "techno gizmos". <br />
                <br />
                Toward the end of his life he was a sought-after lecturer on
                topics including technology and the environment.
              </p>
            </Col>
          </Row>
        </Container>
      </header>
      {/* Highest rated book */}
      <article className="section text-center">
        <Container>
          <Row>
            <Col xs={12} md={6} className="offset-md-6">
              <h2 className="heading heading--left-md text-md-left mb-4">
                <span>Highest rated book</span>
              </h2>
            </Col>
            <Col xs={12} md={6} className="mb-3 mb-md-0 text-md-right">
              <img
                src="https://images.gr-assets.com/books/1511302904l/890.jpg"
                alt="Of Mice and Men"
                className="book-highlight"
              />
            </Col>
            <Col xs={12} md={6} className="text-md-left">
              <p className="h1 font-display font-weight-bold text-break">
                <Link to="/books/1">Of Mice and Men</Link>
              </p>
              <p>
                <span className="text-secondary">by:</span>{' '}
                <Link to="/authors/1">John Steinbeck</Link>
              </p>
              <p className="h2 font-weight-bold text-warning mb-4">£12.00</p>
              <p className="text-description text-justify text-md-left">
                The compelling story of two outsiders striving to find their
                place in an unforgiving world. Drifters in search of work,
                George and his simple-minded friend Lennie have nothing in the
                world except each other and a dream--a dream that one day they
                will have some land of their own. Eventually they find work on a
                ranch in California’s Salinas Valley, but their hopes are doomed
                as Lennie, struggling against extreme cruelty, misunderstanding
                and feelings of jealousy, becomes a victim of his own strength.
                Tackling universal themes such as the friendship of a shared
                vision, and giving voice to America’s lonely and dispossessed,{' '}
                <i>Of Mice and Men</i> has proved one of Steinbeck’s most
                popular works, achieving success as a novel, a Broadway play and
                three acclaimed films.
              </p>
              <Link
                to="/books/1"
                className="btn btn-warning btn-md rounded-pill text-uppercase"
              >
                Read More
              </Link>
            </Col>
          </Row>
        </Container>
      </article>
      {/* Most rated book */}
      <article className="section bg-beige text-center">
        <Container>
          <Row>
            <Col xs={12} md={6}>
              <h2 className="heading heading--right-md text-md-right mb-4">
                <span>Most rated book</span>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              md={{ span: 6, order: 2 }}
              className="mb-3 mb-md-0 text-md-left"
            >
              <img
                src="https://images.gr-assets.com/books/1377756377l/7604.jpg"
                alt="Lolita"
                className="book-highlight"
              />
            </Col>
            <Col xs={12} md={{ span: 6, order: 1 }} className="text-md-right">
              <p className="h1 font-display font-weight-bold text-break">
                <Link to="/books/1">Lolita</Link>
              </p>
              <p>
                <span className="text-secondary">by:</span>{' '}
                <Link to="/authors/1">Vladimir Nabokov</Link>
              </p>

              <p className="h2 font-weight-bold text-warning mb-4">£12.00</p>
              <p className="text-description text-justify text-md-right">
                Humbert Humbert - scholar, aesthete and romantic - has fallen
                completely and utterly in love with Lolita Haze, his landlady's
                gum-snapping, silky skinned twelve-year-old daughter.
                Reluctantly agreeing to marry Mrs Haze just to be close to
                Lolita, Humbert suffers greatly in the pursuit of romance; but
                when Lo herself starts looking for attention elsewhere, he will
                carry her off on a desperate cross-country misadventure, all in
                the name of Love. Hilarious, flamboyant, heart-breaking and full
                of ingenious word play, Lolita is an immaculate, unforgettable
                masterpiece of obsession, delusion and lust.
              </p>
              <Link
                to="/books/1"
                className="btn btn-warning btn-md rounded-pill text-uppercase"
              >
                Read More
              </Link>
            </Col>
          </Row>
        </Container>
      </article>
      {/* All books */}
      <article className="section text-center">
        <h2 className="heading mb-4">
          <span>All books by Douglas Adams</span>
        </h2>
        <div className="d-flex flex-wrap justify-content-center">
          {new Array(6).fill(0).map((book, index) => (
            <TempProductCard
              key={index}
              image="https://images.gr-assets.com/books/1360206420m/11870085.jpg"
              title="The Fault in Our Stars"
              author="John Greene"
              price={23.0}
              className="mx-2"
            />
          ))}
        </div>
      </article>
      {/* Quotes */}
      <article
        className="section bg-beige text-center"
        style={{ overflow: 'hidden' }}
      >
        <Container>
          <h2 className="heading mb-4">
            <span>Quotes by Douglas Adams</span>
          </h2>
          <div className="px-2">
            <Slider {...slickOptions}>
              {new Array(5).fill(0).map((item, index) => (
                <div key={index}>
                  <div className="quote mx-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dignissimos nobis voluptatum excepturi eum maiores.
                    Architecto, voluptatibus nam. Animi iure ea voluptatem
                    distinctio doloribus fugiat, minima, laborum voluptatibus
                    qui totam eveniet ex. Cumque, distinctio itaque facilis
                    dolor est quidem sunt reprehenderit necessitatibus in dicta
                    sit, asperiores sapiente illum quis similique numquam?
                  </div>
                </div>
              ))}
              <div>
                <Link to="/" className="btn btn-warning rounded-pill">
                  Read More Quotes
                </Link>
              </div>
            </Slider>
          </div>
        </Container>
      </article>
    </main>
  );
};

export default Show;
