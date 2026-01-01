import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useFileStore = create(() => ({}));
export default useFileStore;

/**
 *
 * @param {File} file
 * @param {Object|null} options
 * @returns {Promise<Array>}
 */
export const addFile = async (file, options = null) => {
  try {
    const formData = new FormData();
    formData.append('imageFile', file);
    if (options !== null) {
      const keys = Object.keys(options);
      keys.forEach((key) => formData.append(key, options[keys]));
    }

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

export const getPhotoByActorId = async (actorId) => {
  try {
    let response = await fetch(`/api/media_objects?actor=/api/actors/${actorId}`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    if (response.ok) {
      response = await response.json();
      return response['hydra:member'] ?? [];
    }
    return [];
  } catch {}
};
