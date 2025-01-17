import {create} from "zustand";
import { getRequestHeaders } from "../services/data";
import { cleanArrayObjects } from "../services/utils";
import { setTotal } from "./paginatorStore";

const useMovieStore = create((set, get) => ({
   movies: [],
   getMoviesPoster: async (page = 1, keywords = '') => {
      try {
         const fetchMovies = async (page, query) => {
            let response = await fetch(`/api/movies/poster?page=${page}${query}`, {
               method: 'GET',
               headers: getRequestHeaders()
            });
            return await response.json();
         }

         const titleResponse = await fetchMovies(page, `&title=${keywords}`);
         const actorNameResponse = await fetchMovies(page, `&actors.name=${keywords}`);
         const movies = cleanArrayObjects([...titleResponse['hydra:member'], ...actorNameResponse['hydra:member']], 'id');
         set((state) => ({
            ...state, 
            movies: movies
         }));
         setTotal(titleResponse['hydra:totalItems'] > actorNameResponse['hydra:totalItems'] ? titleResponse['hydra:totalItems'] : actorNameResponse['hydra:totalItems']);
      } catch(e) {}
   },
   getMovies: (page, queryOptions = null) => {

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