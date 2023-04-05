import axios from 'axios';

const Jaxios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Jaxios;
