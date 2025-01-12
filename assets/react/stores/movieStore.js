import {create} from "zustand";
import { getRequestHeaders } from "../services/data";

const useMovieStore = create((set, get) => ({
   movies: [],
   getMovies: (page, query) => {

   }
}));
export default useUserStore;