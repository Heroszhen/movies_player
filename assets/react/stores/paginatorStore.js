import { create } from 'zustand';

export const content = {
  page: 1,
  itemsPerPage: 20,
  total: 20,
  route: null,
  keywords: '',
  top: 0,
};

const usePaginatorStore = create(() => content);
export default usePaginatorStore;

export const getPaginator = (route) => {
  let config = localStorage.getItem('paginator') ?? JSON.parse(localStorage.getItem('paginator'));

  if (config === null) {
    usePaginatorStore.setState(() => ({ ...content }));
    config = usePaginatorStore.getState();
  }
  if (typeof config === 'string') config = JSON.parse(localStorage.getItem('paginator'));
  if (config.route !== route) usePaginatorStore.setState(() => ({ ...content }));
  else usePaginatorStore.setState(() => ({ ...config }));
};

export const setPaginator = (config) => {
  usePaginatorStore.setState(() => ({ ...config }));
  localStorage.setItem('paginator', JSON.stringify(usePaginatorStore.getState()));
};

export const setPage = (page) => {
  usePaginatorStore.setState(() => ({ page: page }));
  setPaginator(usePaginatorStore.getState());
};

export const setItemsPerPage = (items) => {
  usePaginatorStore.setState(() => ({ itemsPerPage: items }));
  setPaginator(usePaginatorStore.getState());
};

export const setTotal = (total) => {
  usePaginatorStore.setState(() => ({ total: total }));
  setPaginator(usePaginatorStore.getState());
};

export const setRoute = (route) => {
  usePaginatorStore.setState(() => ({ route: route }));
  setPaginator(usePaginatorStore.getState());
};

export const setKeywords = (keywords) => {
  usePaginatorStore.setState(() => ({ keywords: keywords }));
  setPaginator(usePaginatorStore.getState());
};

export const setTop = (top) => {
  usePaginatorStore.setState(() => ({ top: top }));
  setPaginator(usePaginatorStore.getState());
};

export const getTop = () => {
  return usePaginatorStore.getState().top;
};
