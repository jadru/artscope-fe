import axios from 'axios';
import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';
import { toast } from 'react-toastify';

const Jaxios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getRefreshToken = async () => {
  axios
    .post('/api/refresh', cookie.load('refresh-token'), {
      data: cookie.load('refresh-token'),
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    .then((res) => {
      const { accessToken, refreshToken } = res.data;
      Jaxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
      cookie.remove('refresh-token');
      cookie.save('refresh-token', refreshToken, {
        expires: new Date(decodedRefreshToken.exp * 1000),
        path: '/',
      });
    })
    .catch(() => {
      cookie.remove('refresh-token');
    });
};
Jaxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    if (response && response.status) {
      switch (response.status || config.sent) {
        case 400:
          toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? ' : ' + response.data.detail
                    : ''
                }`);
          return Promise.reject(err);
        case 401:
        case 403:
          if (cookie.load('refresh-token')) {
            config.sent = true;
            await getRefreshToken();
            return axios(config);
          } else {
            if (response.data.message)
              toast.error(
                `${response.data.message} ${response.data.detail || ''}`
              );
            else toast.error(response.data);
            cookie.remove('refresh-token');
            return Promise.reject(err);
          }
        case 502:
        case 500:
          toast.error(`서버에 문제가 있습니다.`);
          return Promise.reject(err);
        default:
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

export default Jaxios;
