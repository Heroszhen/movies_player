import {create} from "zustand";
import { getRequestHeaders } from "../services/data";
import { setTotal } from "./paginatorStore";

const useActorStore = create((set, get) => ({
    actors: [],
    getActors: async (page = 1, keywords = '') => {
        try {
            let response = await fetch(`/api/actors?page=${page}&name=${keywords}`, {
               method: 'GET',
               headers: getRequestHeaders()
            });
            response = await response.json();
            if (response['hydra:member']) {
                set((state) => ({actors: response['hydra:member']}));
                setTotal(response['hydra:totalItems']);
            }
         } catch(e) {}
    },
    editActor: async (data, id) => {
        try {
            let response = await fetch(`/api/actors${id===null ? '' : '/' + id}`, {
               method: id===null ? 'POST' : 'PATCH',
               headers: getRequestHeaders(),
               body: JSON.stringify(data)
            });
            response = await response.json();
            if (response['@id']) {
                if(id === null) set((state) => ({actors: [response, ...get().actors]}));
                else {
                    set((state) => ({actors: get().actors.map(actor=>{
                        if (actor.id === id)return response;
                        return actor;
                    })}));
                }
            }
         } catch(e) {}
    }
}));
export default useActorStore;