import {create} from "zustand";
import {content} from './paginatorStore';

const paginator2Stores = new Map();

export const getPaginator2Stores = (id) => {
  if (!paginator2Stores.has(id)) {
    paginator2Stores.set(
        id,
        create((set, get) => ({
            ...content,
            resetPaginator: () => set((state) => ({ ...state, content })),
            setPage: (page) => set((state) => ({ ...state, page: page })),
            setKeywords: (keywords) => set((state) => ({ ...state, keywords: keywords })),
            setTotal: (total) => set((state) => ({ ...state, total: total })),
            setItemsPerPage: (itemsPerPage) => set((state) => ({ ...state, itemsPerPage: itemsPerPage })),
        }))
    );
  }
  return paginator2Stores.get(id);
};