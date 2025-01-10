export const getRequestHeaders = (isFormData = false) => {
    return {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': !isFormData ? 'application/json' : 'application/json'
    };
}