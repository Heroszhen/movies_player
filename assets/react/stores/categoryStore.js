import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';
import { setTotal } from './paginatorStore';

const useCategoryStore = create((set, get) => ({
  categories: [],
  getCategories: async (page = 1, keywords = '', order = null) => {
    let url = `/api/categories?page=${page}&name=${keywords}`;
    if (order !== null) url += '&' + order;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getRequestHeaders(),
      });

      if (response.ok) {
        const json = await response.json();
        set(() => ({ categories: json['hydra:member'] }));
        setTotal(json['hydra:totalItems']);
      }
    } catch {}
  },
  editCategory: async (data, id) => {
    try {
      let response = await fetch(`/api/categories${id === null ? '' : '/' + id}`, {
        method: id === null ? 'POST' : 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });
      const jsonResponse = await response.json();
      if (response.ok && jsonResponse['id']) {
        if (id === null) set(() => ({ categories: [jsonResponse, ...get().categories] }));
        else {
          set(() => ({
            categories: get().categories.map((category) => {
              if (category.id === id) return jsonResponse;
              return category;
            }),
          }));
        }
      }
    } catch {}
  },
}));
export default useCategoryStore;

export const getCategoriesName = async () => {
  try {
    let response = await fetch(`/api/categories/name`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });
    response = await response.json();
    return response['hydra:member'] ?? [];
  } catch {}
};
