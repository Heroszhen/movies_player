import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useUserStore = create((set, get) => ({
  user: null,
  login: false,
  users: [],
  setUser: (newUser) => {
    set((state) => ({ ...state, user: newUser }));
  },
  getUsers: async () => {
    try {
      let response = await fetch(`/api/users`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });

      response = await response.json();
      if (response['hydra:member']) set((state) => ({ ...state, users: response['hydra:member'] }));
    } catch {}
  },
  editUser: async (data, id) => {
    try {
      let response = await fetch(`/api/users${id === null ? '' : '/' + id}`, {
        method: id === null ? 'POST' : 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });

      response = await response.json();
      if (response['@id']) {
        if (id === null) {
          set(() => ({ users: [response, ...get().users] }));
        } else {
          set(() => ({
            users: get().users.map((user) => {
              if (user.id === id) return response;
              return user;
            }),
          }));
        }
      }
    } catch {}
  },
  deleteUser: async (id) => {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: getRequestHeaders(),
    });
    set(() => ({ users: get().users.filter((user) => user.id !== id) }));
  },
  updatePassword: async (data, id) => {
    try {
      await fetch(`/api/users/${id}/password`, {
        method: 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });
    } catch {}
  },
}));
export default useUserStore;

export const setLogin = async (login) => {
  useUserStore.setState(() => ({ login: login }));
};

/**
 *
 * @param {Object} data
 * @returns {Promise<boolean>}
 */
export const getAuth = async (data) => {
  try {
    let response = await fetch(`/api/auth`, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(data),
    });

    response = await response.json();
    if (response.token) {
      localStorage.setItem('token', JSON.stringify({ token: response.token, email: data.email }));
      getUser();

      return true;
    }
  } catch {}
  return false;
};

export const getUser = () => {
  fetch(`/api/users/profile`, {
    method: 'GET',
    headers: getRequestHeaders(),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response?.id) useUserStore.setState((state) => ({ ...state, user: response }));
    });
};
