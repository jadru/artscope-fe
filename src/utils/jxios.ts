import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

const Jaxios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getRefreshToken = async () => {
  const cookies = new Cookies();
  axios
    .post('/api/refresh', cookies.get('refreshToken'), {
      withCredentials: false,
      data: cookies.get('refreshToken'),
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    .then((res) => {
      const { accessToken, refreshToken } = res.data;
      Jaxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
      cookies.remove('refreshToken');
      cookies.set('refreshToken', refreshToken, {
        expires: new Date(decodedRefreshToken.exp * 1000),
        path: '/',
      });
    })
    .catch(() => {
      cookies.remove('refreshToken');
    });
};
Jaxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    const cookies = new Cookies();
    if (response && response.status) {
      switch (response.status || config.sent) {
        case 401:
        case 403:
          if (cookies.get('refreshToken')) {
            config.sent = true;
            await getRefreshToken();
            return axios(config);
          } else {
            toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? ' : ' + response.data.detail
                    : ''
                }`);
            return Promise.reject(err);
          }
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
