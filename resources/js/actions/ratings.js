import axios from 'axios';

export const addRating = async (rating, book, user) => {
  const response = await axios.post(`/api/users/${user.id}/ratings`, {
    rating,
    book_id: book.id
  });
  return response.data;
};

export const updateRating = async (rating, newRating) => {
  await axios.patch(`/api/ratings/${rating.id}`, {
    rating: newRating
  });
  return newRating;
};

export const deleteRating = async rating => {
  await axios.delete(`/api/ratings/${rating.id}`);
  return rating;
};
