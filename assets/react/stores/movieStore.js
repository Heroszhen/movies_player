import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';
import { cleanArrayObjects, compareObjects } from '../services/utils';
import { setTotal } from './paginatorStore';

const fetchMovies = async (url, page, query) => {
  let response = await fetch(`${url}?page=${page}${query}`, {
    method: 'GET',
    headers: getRequestHeaders(),
  });
  return await response.json();
};

const useMovieStore = create((set, get) => ({
  movies: [],
  videoTypes: [],
  videoQuery: {},
  emptyMovies: () => {
    set(() => ({ movies: [] }));
  },
  getMovies: async (page = 1, keywords = '', needPoster = false, query = null, checkQuery = false) => {
    const newVideoQuery = {
      page: page,
      keywords: keywords,
      needPoster: needPoster,
      query: query,
    };

    if (checkQuery && compareObjects(newVideoQuery, get().videoQuery) && get().movies.length > 0) {
      return;
    }

    set((state) => ({
      ...state,
      videoQuery: newVideoQuery,
    }));

    const url = needPoster === true ? '/api/movies/poster' : '/api/movies';
    try {
      const newQuery = query === null ? '' : '&' + query;
      const titleResponse = await fetchMovies(url, page, `&title=${keywords}${newQuery}`);
      const actorNameResponse = await fetchMovies(url, page, `&actors.name=${keywords}${newQuery}`);
      const movies = cleanArrayObjects([...titleResponse['hydra:member'], ...actorNameResponse['hydra:member']], 'id');
      set((state) => ({
        ...state,
        movies: movies,
      }));
      setTotal(
        titleResponse['hydra:totalItems'] > actorNameResponse['hydra:totalItems']
          ? titleResponse['hydra:totalItems']
          : actorNameResponse['hydra:totalItems']
      );
    } catch {}
  },
  editVideoType: async (data, id = null) => {
    try {
      let response = await fetch(`/api/video_types${id === null ? '' : '/' + id}`, {
        method: id === null ? 'POST' : 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });

      const jsonResponse = await response.json();
      if (response.ok && jsonResponse['id']) {
        if (id === null) {
          set(() => ({
            videoTypes: [...get().videoTypes, jsonResponse],
          }));
        } else {
          set((state) => ({
            videoTypes: state.videoTypes.map((type) => {
              if (type.id === id) return jsonResponse;
              return type;
            }),
          }));
        }
      }
    } catch {}
  },
  editMovie: async (data, id = null) => {
    try {
      let response = await fetch(`/api/movies${id === null ? '' : '/' + id}`, {
        method: id === null ? 'POST' : 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });

      const jsonResponse = await response.json();
      if (response.ok && jsonResponse['id']) {
        if (id === null) {
          set((state) => ({
            movies: [jsonResponse, ...state.movies],
          }));
        } else {
          set((state) => ({
            movies: state.movies.map((movie) => {
              if (movie.id === id) return jsonResponse;
              return movie;
            }),
          }));
        }
      }
    } catch {}
  },
  deleteMovie: async (id) => {
    try {
      let response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
        headers: getRequestHeaders(),
      });

      if (response.ok) {
        set((state) => ({ movies: state.movies.filter((movie) => movie.id !== id) }));
      }
    } catch {}
  },
  getVideoByActor: async (page = 1, actorId) => {
    try {
      let response = await fetch(`/api/movies/actor?page=${page}&actors.id=${actorId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      const jsonResponse = await response.json();
      if (response.ok && jsonResponse['hydra:member']) {
        set(() => ({ movies: jsonResponse['hydra:member'] }));
        setTotal(jsonResponse['hydra:totalItems']);
      }

      return jsonResponse['hydra:member'];
    } catch {}
  },
}));
export default useMovieStore;

export const getMovie = async (id) => {
  try {
    let response = await fetch(`/api/movies/${id}`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });
    return await response.json();
  } catch {}
};

export const getVideoTypes = async () => {
  try {
    let response = await fetch(`/api/video_types`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });
    const jsonResponse = await response.json();
    useMovieStore.setState(() => ({ videoTypes: jsonResponse['hydra:member'] }));

    return jsonResponse['hydra:member'];
  } catch {}
};

/**
 *
 * @param {Array} categories
 * @param {string} keywords
 * @param {number} page
 * @returns {Object|null}
 */
export const getMoviesByCategories = async (categoryIds, keywords = null, page = null, checkQuery = false) => {
  const newVideoQuery = {
    categoryIds: categoryIds,
    keywords: keywords,
    page: page,
  };

  if (
    checkQuery &&
    compareObjects(newVideoQuery, useMovieStore.getState().videoQuery) &&
    useMovieStore.getState().movies.length > 0
  ) {
    return;
  }

  useMovieStore.setState((state) => ({
    ...state,
    videoQuery: newVideoQuery,
  }));

  const url = new URL('/api/movies/by-categories', window.location.origin);
  categoryIds.forEach((id) => url.searchParams.append('categories[]', id));
  url.searchParams.set('page', page ?? 1);
  url.searchParams.set('keywords', keywords);

  try {
    let response = await fetch(url.toString(), {
      method: 'GET',
      headers: getRequestHeaders(),
    });
    if (response.ok) {
      const jsonResponse = await response.json();

      useMovieStore.setState((state) => ({
        ...state,
        movies: jsonResponse['hydra:member'],
      }));

      setTotal(jsonResponse['hydra:totalItems']);

      return jsonResponse['hydra:member'] ? jsonResponse : null;
    }

    return null;
  } catch {}
};
