import { create } from 'zustand';

const usePhotoModalStore = create(() => ({
  photos: [],
}));
export default usePhotoModalStore;

export const setPhotosInModal = (newPhotos) => {
  usePhotoModalStore.setState((state) => ({ ...state, photos: newPhotos }));
};

export const getPhotosFromModal = () => {
  return usePhotoModalStore.getState().photos;
};
