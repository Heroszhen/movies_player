import {create} from "zustand";
import { getRequestHeaders } from "../services/data";

const useMovieStore = create((set, get) => ({
   movies: [],
   getMoviesPoster: async (page, queryOptions = null) => {
      try {
         const query = `/api/movies/poster`;
         if (queryOptions !== null) query += `?${queryOptions}`;
         let response = await fetch(query, {
            method: 'GET',
            headers: getRequestHeaders()
         });
         response = await response.json();
         set((state) => ({
            ...state, 
            movies: response['hydra:member']
         }));
      } catch(e) {}
   },
   getMovies: (page, queryOptions = null) => {

   }
}));
export default useMovieStore;