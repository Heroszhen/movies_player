import {create} from "zustand";

const content = {
    page:1,
    itemsPerPage: 20,
    total:20,
    route: null,
    keywords: ''
}

const usePaginatorStore = create((set, get) => (content));
export default usePaginatorStore;

export const getPaginator = (route) => {
    let config = localStorage.getItem('paginator') ?? JSON.parse(localStorage.getItem('paginator'));

    if (config === null) {
        usePaginatorStore.setState((state) => ({...content}));
        config = usePaginatorStore.getState();
    }
    if (typeof config === 'string')config = JSON.parse(localStorage.getItem('paginator'));
    if (config.route !== route)usePaginatorStore.setState((state) => ({...content}));
    else usePaginatorStore.setState((state) => ({...config}));
}

export const setPaginator = (config) => {
    usePaginatorStore.setState((state) => ({...config})); 
    localStorage.setItem('paginator', JSON.stringify(usePaginatorStore.getState()));
}

export const setPage = (page) => {
    usePaginatorStore.setState((state) => ({page: page}));
    setPaginator(usePaginatorStore.getState());
}

export const setItemsPerPage = (items) => {
    usePaginatorStore.setState((state) => ({itemsPerPage: items}));    
    setPaginator(usePaginatorStore.getState());
}

export const setTotal = (total) => {
    usePaginatorStore.setState((state) => ({total: total}));    
    setPaginator(usePaginatorStore.getState());
}

export const setRoute = (route) => {
    usePaginatorStore.setState((state) => ({route: route}));    
    setPaginator(usePaginatorStore.getState());
}

export const setKeywords = (keywords) => {
    usePaginatorStore.setState((state) => ({keywords: keywords}));    
    setPaginator(usePaginatorStore.getState());
}