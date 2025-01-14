import {create} from "zustand";
import { getRequestHeaders } from "../services/data";
import { setTotal } from "./paginatorStore";

const useMovieStore = create((set, get) => ({
   movies: [],
   getMoviesPoster: async (page = 1, queryOptions = null) => {
      try {
         const query = `/api/movies/poster?page=${page}`;
         if (queryOptions !== null) query += `$${queryOptions}`;
         let response = await fetch(query, {
            method: 'GET',
            headers: getRequestHeaders()
         });
         response = await response.json();
         set((state) => ({
            ...state, 
            movies: response['hydra:member']
         }));
         setTotal(response['hydra:totalItems']);
      } catch(e) {}
   },
   getMovies: (page, queryOptions = null) => {

   }
}));
export default useMovieStore;