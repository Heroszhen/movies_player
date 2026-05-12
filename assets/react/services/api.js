import { getRequestHeaders } from './data';

/**
 * @returns {Fetch}
 */
export const getCounts = () => {
  return fetch(`/api/counts`, {
    method: 'GET',
  });
};

/**
 * @returns {Fetch}
 */
export const getLastThreeMovies = () => {
  return fetch(`/api/movies/last-three-movies`, {
    method: 'GET',
    headers: getRequestHeaders(),
  });
};
