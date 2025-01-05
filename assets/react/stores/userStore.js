import {create} from "zustand";

const useUserStore = create((set, get) => ({
    user: null,
    login: false
}));
export default useUserStore;

export const setLogin = async (login) => {
    useUserStore.setState((state) => ({login: login}));
};