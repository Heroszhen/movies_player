import {create} from "zustand";
import { getRequestHeaders } from "../services/data";
import { cleanArrayObjects } from "../services/utils";
import { setTotal } from "./paginatorStore";

const useMovieStore = create((set, get) => ({
   movies: [],
   getMoviesPoster: async (page = 1, keywords = '') => {
      try {
         const fetchMovies = async (page, query) => {
            let url = `/api/movies/poster?page=${page}${query}`;
            let response = await fetch(url, {
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
      } catch(e) {console.log(e)}
   },
   getMovies: (page, queryOptions = null) => {

   },
}));
export default useMovieStore;

export const getMovie = (id) => {
   
}