import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useFileStore = create(() => ({}));
export default useFileStore;

export const addFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('imageFile', file);
    let response = await fetch(`/api/media_objects`, {
      method: 'POST',
      headers: getRequestHeaders(true),
      body: formData,
    });

    response = await response.json();
    return response;
  } catch {}
};

export const deletePhoto = async (id) => {
  try {
    let response = await fetch(`/api/media_objects/${id}`, {
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
