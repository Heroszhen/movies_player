export const getRequestHeaders = (isFormData = false) => {
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': !isFormData ? 'application/json' : 'application/json'
    };

    if (localStorage.getItem('token')) {
        headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('token')).token}`;
    }
    return headers;
}