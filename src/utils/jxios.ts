import axios from 'axios';

const Jaxios = axios.create({
  withCredentials: true,
});

export default Jaxios;
