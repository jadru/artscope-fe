import axios from 'axios';
import { decode } from 'html-entities';
import cookie from 'react-cookies';
import { toast } from 'react-toastify';

import {
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/auth/cookieTokenManager';

import { loginResponseType } from '@/types/auth';

const Jxios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const getRefreshToken = async () => {
  axios
    .post('/api/refresh', cookie.load('refresh-token'), {
      data: cookie.load('refresh-token'),
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    .then((res) => {
      const tokenData: loginResponseType = res.data;
      Jxios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${tokenData.accessToken}`;
      setAccessToken(tokenData.accessToken, tokenData.expiresIn);
      setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
    })
    .catch(() => {
      removeRefreshToken();
    });
};
Jxios.interceptors.response.use(
  (res) => {
    // every response will be decoded
    if (res.data) {
      if (typeof res.data === 'string') {
        res.data = decode(res.data);
      } else if (typeof res.data === 'object') {
        Object.keys(res.data).forEach((key) => {
          if (typeof res.data[key] === 'string') {
            res.data[key] = decode(res.data[key]);
          }
        });
      }
    }
    return res;
  },
  async (err) => {
    const { config, response } = err;
    if (response && response.status) {
      switch (response.status || config.sent) {
        case 400:
        case 401:
          if (typeof window !== 'undefined')
            toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? ' : ' + response.data.detail
                    : ''
                }`);
          return Promise.reject(err);
        case 403:
          if (typeof window !== 'undefined')
            if (cookie.load('refresh-token')) {
              config.sent = true;
              await getRefreshToken();
              return axios(config);
            } else {
              cookie.remove('refresh-token');
              cookie.remove('access-token');
              toast.warn('로그인이 필요합니다.');
              return Promise.reject(err);
            }
          break;
        case 502:
        case 500:
          return Promise.reject(err);
        default:
          if (typeof window !== 'undefined')
            toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? ' : ' + response.data.detail
                    : ''
                }`);
          return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default Jxios;
