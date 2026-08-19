import { getRequestHeaders } from '../../services/data';
import { fetchUtils } from 'react-admin';

const httpClient = fetchUtils.fetchJson;
const apiUrl = '/api';

const dataProvider = {
  getOne: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'GET',
      headers: new Headers(getRequestHeaders()),
    });

    return {
      data: json,
    };
  },
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    let url = `${apiUrl}/${resource}`;
    const query = new URLSearchParams();

    if (!['users'].includes(resource)) {
      if (page) query.set('page', page);
      if (perPage) query.set('itemsPerPage', perPage);
    }

    const { field, order } = params.sort;
    query.set(`order[${field}]`, order);

    if (query.size !== 0) url += `?${query}`;

    const { json } = await httpClient(url, {
      method: 'GET',
      headers: new Headers(getRequestHeaders()),
    });

    return {
      data: json['hydra:member'],
      total: json['hydra:totalItems'],
    };
  },
  updateMany: async (resource, params) => {
    const requests = params.ids.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
    );

    const responses = await Promise.all(requests);

    return {
      data: responses.map((response) => response.json.id),
    };
  },
  create: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      headers: new Headers(getRequestHeaders()),
      body: JSON.stringify(params.data),
    });

    return {
      data: json,
    };
  },
  update: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PATCH',
      headers: getRequestHeaders(),
      body: JSON.stringify(params.data),
    });

    return {
      data: json,
    };
  },
  delete: async (resource, params) => {
    await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: new Headers(getRequestHeaders()),
    });

    return {
      data: params.previousData,
    };
  },
  deleteMany: async (resource, params) => {
    console.log(resource, params);
    console.log('deleteMany called with ids:', params.ids);
    const requests = params.ids.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
        headers: new Headers(getRequestHeaders()),
      })
    );

    await Promise.all(requests);

    return {
      data: params.ids,
    };
  },
};
export default dataProvider;
