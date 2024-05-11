import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token: string) => {
  Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default Api;
