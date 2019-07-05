import axios from 'axios';

export const addRating = async (rating, bookId, userId) => {
  const response = await axios.post(`/api/users/${userId}/ratings`, {
    rating,
    book_id: bookId
  });
  return response.data;
};

export const updateRating = async (ratingId, newRating) => {
  const response = await axios.patch(`/api/ratings/${ratingId}`, {
    rating: newRating
  });
  return response.data;
};

export const deleteRating = async ratingId =>
  await axios.delete(`/api/ratings/${ratingId}`);
