export const readFile = (file) => {
    new Promise((resolve, reject) => {
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