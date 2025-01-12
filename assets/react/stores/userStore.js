import {create} from "zustand";
import { getRequestHeaders } from "../services/data";

const useUserStore = create((set, get) => ({
    user: null,
    login: false,
    setUser: (newUser) => {
        set((state) => ({user: newUser}))
    }
}));
export default useUserStore;

export const setLogin = async (login) => {
    useUserStore.setState((state) => ({login: login}));
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
            body: JSON.stringify(data)
        });

        response = await response.json();
        if (response.token) {
            localStorage.setItem('token', JSON.stringify({token: response.token, email: data.email}));
            getUser();

            return true;
        }
    } catch(e) {}

    return false;
}

export const getUser = () => {
    fetch(`/api/users/profile`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
            email: JSON.parse(localStorage.getItem('token')).email
        })
    })
    .then(response => response.json())
    .then(response => {
        if (response?.id)useUserStore.setState((state) => ({user: response}));
    });
}