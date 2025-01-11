import {create} from "zustand";

const useLoaderStore = create((set, get) => ({
    loader: false,
    setLoader: (newLoader) => {set((state) => ({loader: newLoader}))},
}));
export default useLoaderStore;