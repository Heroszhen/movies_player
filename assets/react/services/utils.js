export const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

export const wait = (n) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, n * 1000);
    });
}

/**
 * remove all duplications with one field from one array
 * @param {Array<Object>} tab 
 * @param {string} field 
 * @returns {Array<Object>}
 */
export const cleanArrayObjects = (tab, field) => {
    const map = new Map();
    tab.forEach((obj) => map.set(obj[field], obj));
    return Array.from(map.values());
}

/**
 * 
 * @param {File} file 
 * @returns {boolean}
 */
export const isImageFile = (file) => {
    const extensions = ['jpg', 'jpeg', 'png', 'avif'];

    if (!file.type.includes('image')) return false;

    const tab = file.type.split('/');
    if (!extensions.includes(tab[tab.length - 1].toLowerCase()))return false;

    return true;
}