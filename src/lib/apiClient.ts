const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Handle Django paginated response
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }
  
  return data;
}

export const toolsAPI = {
  getAll: () => fetchAPI('/tools/?page_size=1000'),
  getById: (id: number) => fetchAPI(`/tools/${id}/`),
  search: (query: string) => 
    fetchAPI('/tools/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  create: (data: any) =>
    fetchAPI('/tools/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchAPI(`/tools/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI(`/tools/${id}/`, {
      method: 'DELETE',
    }),
};

export const reviewsAPI = {
  getByToolId: (toolId: number) => 
    fetchAPI(`/reviews/?tool_id=${toolId}&page_size=1000`),
  create: (data: any) =>
    fetchAPI('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const dealsAPI = {
  getAll: () => fetchAPI('/deals/'),
};

export const newsAPI = {
  getAll: () => fetchAPI('/news/'),
  getById: (id: number) => fetchAPI(`/news/${id}/`),
};

export const newsletterAPI = {
  subscribe: (email: string, source: string = 'homepage') =>
    fetchAPI('/newsletter/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    }),
};

export const categoriesAPI = {
  getAll: () => fetchAPI('/categories/'),
};
