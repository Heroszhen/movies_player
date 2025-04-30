import { create } from 'zustand';

const useLoaderStore = create((set) => ({
  loader: false,
  setLoader: (newLoader) => {
    set(() => ({ loader: newLoader }));
  },
}));
export default useLoaderStore;
