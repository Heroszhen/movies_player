import {create} from "zustand";
import { getRequestHeaders } from "../services/data";

const useUserStore = create((set, get) => ({
    user: null,
    login: false
}));
export default useUserStore;

export const setLogin = async (login) => {
    useUserStore.setState((state) => ({login: login}));
};

export const getAuth = async (data) => {
    fetch(`/api/auth`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status !== 404) {
            return response.json()
        }
    })
    .then(response => {})
    .finally()
}