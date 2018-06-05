import axios from 'axios';
import uuidv4 from 'uuid/v4';

const execute = (method, endpoint, data, config) =>
  axios({
    method,
    url: endpoint,
    data,
    config
  });

const get = (endpoint) =>
  execute('get', endpoint);

const post = (endpoint, data, config) =>
  execute('post', endpoint, data, config);

const put = (endpoint, data) =>
  execute('put', endpoint, data);

const patch = (endpoint, data) =>
  execute('patch', endpoint, data);

const del = (endpoint) =>
  execute('delete', endpoint);

export const genericErrorHandler = (error) =>
  console.log(error);

// post location

export const postLocation = (lat, lng) =>
  post('https://api.betterfixit.nl/v1/locations/list/', {
    sender_uuid: uuidv4,
    lat,
    lng
  });

