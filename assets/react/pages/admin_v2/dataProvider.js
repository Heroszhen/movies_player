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

    const data = { ...json };

    if (resource === 'movies') {
      if (data.type && typeof data.type === 'object') data.type = data.type.id;
      if (Array.isArray(data.actors)) {
        data.actors = data.actors.map((actor) => (typeof actor === 'object' ? actor.id : actor));
      }
      if (Array.isArray(data.categories)) {
        data.categories = data.categories.map((category) => (typeof category === 'object' ? category.id : category));
      }
    }

    return { data };
  },
  getMany: async (resource, params) => {
    const validIds = params.ids.filter((id) => id !== null && id !== undefined && typeof id !== 'object');

    if (validIds.length === 0) {
      return { data: [] };
    }

    const responses = await Promise.all(
      validIds.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'GET',
          headers: new Headers(getRequestHeaders()),
        })
      )
    );

    return {
      data: responses.map((response) => response.json),
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

    const filters = params.filter;
    if (Object.keys(filters).length > 0) {
      for (let key in filters) {
        if (typeof filters[key] === 'object') {
          for (let key2 in filters[key]) {
            query.set(`${key}.${key2}`, filters[key][key2]);
          }
        } else {
          query.set(key, filters[key]);
        }
      }
    }

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
      headers: new Headers(getRequestHeaders(false, true)),
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
