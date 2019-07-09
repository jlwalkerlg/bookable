import axios from 'axios';

export const addReview = async (review, book, userId) => {
  const response = await axios.post(`/api/users/${userId}/reviews`, {
    review,
    book_id: book.id
  });
  return response.data;
};

export const updateReview = async (reviewId, newReview) => {
  const response = await axios.patch(`/api/reviews/${reviewId}`, {
    review: newReview
  });
  return response.data;
};

export const deleteReview = reviewId => {
  return axios.delete(`/api/reviews/${reviewId}`);
};
