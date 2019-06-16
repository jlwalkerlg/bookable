import { SHELVES_HYDRATE } from './types';

export const hydrateShelves = shelves => ({
  type: SHELVES_HYDRATE,
  shelves
});
