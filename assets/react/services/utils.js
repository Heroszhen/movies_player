export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const wait = (n) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, n * 1000);
  });
};

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
};

/**
 *
 * @param {File} file
 * @returns {boolean}
 */
export const isImageFile = (file) => {
  const extensions = ['jpg', 'jpeg', 'png', 'avif', 'gif', 'webp'];

  if (!file.type.includes('image')) return false;

  const tab = file.type.split('/');
  if (!extensions.includes(tab[tab.length - 1].toLowerCase())) return false;

  return true;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
  window.location.reload();
};

export const isEmpty = (elm) => {
  if (elm === null || elm === undefined) return true;

  if (Array.isArray(elm) && elm.length === 0) return true;

  if (typeof elm === 'string' && elm === '') return true;

  return false;
};

/**
 *
 * @param {object} obj1
 * @param {object} obj2
 * @returns
 */
export const compareObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
