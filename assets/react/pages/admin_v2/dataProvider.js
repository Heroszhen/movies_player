import { getRequestHeaders } from '../../services/data';

const apiUrl = '/api';

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    let url = `${apiUrl}/${resource}`;
    const query = new URLSearchParams();

    if (!['users'].includes(resource)) {
      if (page) query.set('page', page);
      if (perPage) query.set('itemsPerPage', perPage);
    }
    if (query.size !== 0) url += `?${query}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    const json = await response.json();

    return {
      data: json['hydra:member'],
      total: json['hydra:totalItems'],
    };
  },
  update: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PATCH',
      headers: getRequestHeaders(),
      body: JSON.stringify(params.data),
    });

    const json = await response.json();

    return {
      data: json,
    };
  },
};
export default dataProvider;
