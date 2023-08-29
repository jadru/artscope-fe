/* eslint-disable */

import returnFetch from 'return-fetch';

const SuperFetch = returnFetch({
  baseUrl: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  interceptors: {
    request: async (args) => {
      console.log('********* before sending request *********');
      console.log('url:', args[0].toString());
      console.log('requestInit:', args[1], '\n\n');
      return args;
    },

    response: async (response, requestArgs) => {
      console.log('********* after receiving response *********');
      console.log('url:', requestArgs[0].toString());
      console.log('requestInit:', requestArgs[1], '\n\n');
      return response;
    },
  },
});
