import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const usePhotoStore = create(() => ({}));
export default usePhotoStore;

export const deletePhoto = async (id) => {
  try {
    let response = await fetch(`/api/edia_objects/${id}`, {
      method: 'DELETE',
      headers: getRequestHeaders(),
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
