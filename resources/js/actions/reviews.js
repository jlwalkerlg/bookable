import axios from 'axios';

export const addReview = async (review, book, user) => {
  const response = await axios.post(`/api/users/${user.id}/reviews`, {
    review,
    book_id: book.id
  });
  return response.data;
};

export const updateReview = async (review, newReview) => {
  const response = await axios.patch(`/api/reviews/${review.id}`, {
    review: newReview
  });
  return response.data;
};

export const deleteReview = async review => {
  await axios.delete(`/api/reviews/${review.id}`);
  return review;
};
