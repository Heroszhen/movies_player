import {create} from "zustand";

const useLoaderStore = create((set, get) => ({
    loader: false
}));
export default useLoaderStore;