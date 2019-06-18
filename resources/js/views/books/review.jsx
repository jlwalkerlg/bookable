handleRatingChange = e => {
  const rating = 5 - parseInt(e.target.dataset.index);
  if (rating === this.state.rating) {
    this.setState({ rating: 0 });
  } else {
    this.setState({ rating });
  }
};

{
  /* Reviews */
}
<article id="reviews" className="section">
  <Container>
    <h3 className="text-uppercase mb-3 h6">Reviews</h3>
    <section className="mb-5">
      {(!review.id || editReview) && (
        <Form onSubmit={this.handleReviewSubmit}>
          <Form.Group>
            <Form.Label>Your rating:</Form.Label>{' '}
            <Stars
              rating={review.rating}
              editable
              onClick={this.handleRatingChange}
            />
          </Form.Group>
          <Form.Group controlId="review">
            <Form.Label srOnly>Your review</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Write a review for this book..."
              value={review.review}
              onChange={this.handleReviewChange}
              className="placeholder-inherit"
            />
          </Form.Group>
          <Button
            variant={review.id ? 'info' : 'warning'}
            type="submit"
            className="rounded-pill d-inline-block"
          >
            {review.id ? 'Edit Review' : 'Submit Review'}
          </Button>
          {editReview && (
            <Button
              variant="link"
              className="ml-3 d-inline-block"
              onClick={this.toggleEditReview}
            >
              Cancel
            </Button>
          )}
        </Form>
      )}
      {review.id && !editReview && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="text-secondary">Your review:</p>
            <Button
              variant="outline-info"
              size="sm"
              onClick={this.toggleEditReview}
            >
              Edit Review
            </Button>
          </div>
          <Media>
            <img
              src="https://via.placeholder.com/150/92c952"
              alt={`${user.name} profile picture`}
              width="70"
              height="70"
              className="mr-3"
            />
            <Media.Body>
              <div className="d-md-flex">
                <p className="mb-2 mr-auto">
                  <span className="h6 mr-2 d-block d-md-inline-block">
                    {user.name}
                  </span>
                  <span className="mr-2">rated it</span>
                  <Stars rating={review.rating || 0} />
                </p>
                <p className="text-secondary">{review.created_at}</p>
              </div>
              <p>{review.review}</p>
            </Media.Body>
          </Media>
          <hr />
        </div>
      )}
    </section>
    <section>
      {book.reviews
        .filter(review => review.user_id !== user.id)
        .map((review, index) => (
          <Media key={index}>
            <img
              src="https://via.placeholder.com/150/92c952"
              alt={`${review.user.name} profile picture`}
              width="70"
              height="70"
              className="mr-3"
            />
            <Media.Body>
              <div className="d-md-flex">
                <p className="mb-2 mr-auto">
                  <span className="h6 mr-2 d-block d-md-inline-block">
                    {review.user.name}
                  </span>
                  <span className="mr-2">rated it</span>
                  <Stars rating={review.rating || 0} />
                </p>
                <p className="text-secondary">{review.created_at}</p>
              </div>
              <p>{review.review}</p>
            </Media.Body>
          </Media>
        ))}
    </section>
  </Container>
</article>;
