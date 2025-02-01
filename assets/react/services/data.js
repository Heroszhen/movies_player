export const getRequestHeaders = (isFormData = false) => {
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    };

    if (isFormData)delete headers['Content-Type'];

    if (localStorage.getItem('token')) {
        headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('token')).token}`;
    }
    return headers;
}

export const getModalStyle = () => {
    return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxWidth: '95%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 2,
        maxHeight: '99%',
        overflow: 'auto'
    };
}