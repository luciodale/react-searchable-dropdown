import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { emitAuthError } from './utils';

const customFetch: typeof fetch = async (url, initOptions) => {
  try {
    const response = await fetch(url, initOptions);
    
    if (!response.ok) {
      console.error("Error response status:", response.status);

      if (response.status === 401) {
        emitAuthError();
      }
    }
    
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const baseQuery = fetchBaseQuery({
  baseUrl: '/',  // adjust as needed
  fetchFn: customFetch,
  prepareHeaders: (headers) => {
    headers.set('content-type', 'application/json');
    return headers;
  },
  credentials: 'include',
});