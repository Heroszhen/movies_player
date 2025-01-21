import {create} from "zustand";
import { getRequestHeaders } from "../services/data";
import { cleanArrayObjects } from "../services/utils";
import { setTotal } from "./paginatorStore";

const fetchMovies = async (url, page, query) => {
   let response = await fetch(`${url}?page=${page}${query}`, {
      method: 'GET',
      headers: getRequestHeaders()
   });
   return await response.json();
}

const useMovieStore = create((set, get) => ({
   movies: [],
   emptyMovies: () => {set((state)=>({movies:[]}))},
   getMovies: async (page = 1, keywords = '', needPoster = false) => {
      const url = needPoster === true ? '/api/movies/poster' : '/api/movies';
      try {
         const titleResponse = await fetchMovies(url, page, `&title=${keywords}`);
         const actorNameResponse = await fetchMovies(url, page, `&actors.name=${keywords}`);
         const movies = cleanArrayObjects([...titleResponse['hydra:member'], ...actorNameResponse['hydra:member']], 'id');
         set((state) => ({
            ...state, 
            movies: movies
         }));
         setTotal(titleResponse['hydra:totalItems'] > actorNameResponse['hydra:totalItems'] ? titleResponse['hydra:totalItems'] : actorNameResponse['hydra:totalItems']);
      } catch(e) {}
   }
}));
export default useMovieStore;

export const getMovie = async (id) => {
   try {
      let response = await fetch(`/api/movies/${id}`, {
         method: 'GET',
         headers: getRequestHeaders()
      });
      return await response.json();
   } catch(e) {}
}