import {create} from "zustand";
import { getRequestHeaders } from "../services/data";

const useFileStore = create((set, get) => ({
    
}));
export default useFileStore;

export const addFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('imageFile', file);
        let response = await fetch(`/api/media_objects`, {
            method: 'POST',
            headers: getRequestHeaders(true),
            body: formData
        });

        response = await response.json();
        return response;
    } catch(e) {}
}