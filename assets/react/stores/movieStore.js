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
   videoTypes: [],
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
   },
   editVideoType: async (data, id = null) => {
      try {
         let response = await fetch(`/api/video_types${id === null ? '' : '/' + id}`, {
            method: id === null ? 'POST' : 'PATCH',
            headers: getRequestHeaders(),
            body: JSON.stringify(data)
         });

         const jsonResponse = await response.json();
         if (response.ok && jsonResponse['id']) {
            if (id === null) {
               useMovieStore.setState((state) => ({
                  videoTypes: [...get().videoTypes, jsonResponse]
               }));
            } else {
               useMovieStore.setState((state) => ({
                  videoTypes: state.videoTypes.map(type=>{
                     if (type.id === id)return jsonResponse;
                     return type;
                  })
               }));
            }
         }
      } catch(e) {}
   },
   editMovie: async (data, id = null) => {
      try {
         let response = await fetch(`/api/movies${id === null ? '' : '/' + id}`, {
            method: id === null ? 'POST' : 'PATCH',
            headers: getRequestHeaders(),
            body: JSON.stringify(data)
         });

         const jsonResponse = await response.json();
         if (response.ok && jsonResponse['id']) {
            if (id === null) {
               useMovieStore.setState((state) => ({
                  movies: [jsonResponse, ...state.movies]
               }));
            } else {
               useMovieStore.setState((state) => ({
                  movies: state.movies.map(movie=>{
                     if (movie.id === id)return jsonResponse;
                     return movie;
                  })
               }));
            }
         }
      } catch(e) {}
   },
   deleteMovie: async (id) => {
      try {
         let response = await fetch(`/api/movies/${id}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
         });

         if(response.ok) {
            useMovieStore.setState((state) => ({movies: state.movies.filter(movie=>movie.id !== id)}));
         }
      } catch(e) {}
   },
   getVideoByActor: async (page = 1, actorId, keywords = '') =>{
      try {
         let response = await fetch(`/api/movies/actor?page=${page}&actors.id=${actorId}`, {
            method: 'GET',
            headers: getRequestHeaders()
         });
         const jsonResponse = await response.json();
         if (response.ok && jsonResponse['hydra:member']) {
            useMovieStore.setState((state) => ({movies: jsonResponse['hydra:member']}));
            setTotal(jsonResponse['hydra:totalItems']);
         }
   
         return jsonResponse['hydra:member'];
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

export const getVideoTypes = async () => {
   try {
      let response = await fetch(`/api/video_types`, {
         method: 'GET',
         headers: getRequestHeaders()
      });
      const jsonResponse = await response.json();
      useMovieStore.setState((state) => ({videoTypes: jsonResponse['hydra:member']}));

      return jsonResponse['hydra:member'];
   } catch(e) {}
}
