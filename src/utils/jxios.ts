import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Cookies } from 'react-cookie';

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
      cookies.set('refreshToken', refreshToken, {
        expires: new Date(decodedRefreshToken.exp * 1000),
        path: '/',
      });
    })
    .catch(() => {
      cookies.remove('refreshToken', { path: '/' });
    });
};

Jaxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const {
      config,
      response: { status },
    } = err;

    /** 1 */
    if (status !== 401 || config.sent) {
      return Promise.reject(err);
    }

    /** 2 */
    config.sent = true;
    await getRefreshToken();

    return axios(config);
  }
);

export default Jaxios;
