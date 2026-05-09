import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useConfigStore = create((set) => ({
  config: null,
  getConfig: async () => {
    try {
      const response = await fetch(`/api/configs/1`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        set((state) => ({ ...state, config: data }));
      }
    } catch {}
  },
  updateConfig: async (data) => {
    try {
      const response = await fetch(`/api/configs/1`, {
        method: 'PATCH',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        set((state) => ({ ...state, config: data }));
      }
    } catch {}
  },
}));
export default useConfigStore;
