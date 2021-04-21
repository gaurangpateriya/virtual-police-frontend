/* eslint-disable no-nested-ternary */
import axios from 'axios';

const env = process.env.REACT_APP_ENV.trim();
const API_ROOT =
  env === 'development'
    ? 'http://localhost:8000/api'
    : env === 'staging'
      ? 'https://api.aconsult.xyz/api'
      : 'https://api.aconsult.xyz/api';

// console.log(process.env);
axios.defaults.baseURL = API_ROOT;
axios.defaults.timeout = 100 * 1000;
axios.defaults.headers = {};

const setToken = (token) => {
  axios.defaults.headers.common = { token };
};
const getToken = () => axios.defaults.headers.common;
const responseBody = (response) => response;

const requests = {
  delete: (url, data) => axios.delete(`${url}`, { data }).then(responseBody),
  get: (url, props) => axios.get(`${url}`, props).then(responseBody),
  // getAndPushToUrl: url => superagent.get(`${url}`).use(tokenPlugin).then(responseBody),
  getPaginated: (url, pageNum) =>
    axios.get(`${url}`).set('page_num', pageNum).then(responseBody),
  put: (url, body) => axios.put(`${url}`, body).then(responseBody),
  post: (url, body) => axios.post(`${url}`, body).then(responseBody),
  postFile: (url, data) => {
    const formData = new FormData();
    data.forEach((d) => {
      formData.append(d.key, d.file);
    });

    return axios
      .post(`${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(responseBody);
  },
};

const Auth = {
  login: (data) => requests.post('/auth/employee/login', data),
  register: (data) => requests.post('/auth/register', data),
  forgotPassword: (data) => requests.post('/auth/forgot-password', data),
  resetPassword: (password) => requests.post('/auth/reset-password', password),
  getHoldTypes: () => requests.get('/hold/get'),
};

const Dashboard = {
  getSosOverView: () => requests.get('/admin/sos/overview'),
  getFirOverView: () => requests.get('/admin/fir/overview'),
  getEmpOverView: () => requests.get('/admin/employee/overview'),
  getNocOverView: () => requests.get('/admin/noc/overview'),

};

const UserDetails = {

};
const Employees = {
  getEmployees: () => requests.get('/admin/employee/get'),
  addEmployee: (emp) => requests.post('/admin/employee/add', emp),
  updateEmployee: (empId, emp) => requests.post(`/admin/employee/update/${empId}`, emp),
  deleteEmployee: (empId) => requests.post(`/admin/employee/delete/${empId}`),
  getFilteredEmps: (search) => requests.get(`/admin/employee/get${search}`),

}
const Firs = {
  getFirs: () => requests.get('/admin/fir/get'),
  getFilteredFirs: (search) => requests.get(`/admin/fir/get${search}`),
  getFirDetails: (id) => requests.get(`/admin/fir/get?id=${id}`),
  updateFir: (fir) => requests.post('/admin/fir/update', fir)
}

const Nocs = {
  getNocs: () => requests.get('/admin/noc/get'),
  getFilteredNocs: (search) => requests.get(`/admin/noc/get${search}`),
  getNocDetails: (id) => requests.get(`/admin/noc/get?id=${id}`),
  updateNoc: (noc) => requests.post('/admin/noc/update', noc),
  verifyNoc: (noc) => requests.postFile('/admin/noc/verify', noc)
}

const SosPage = {
  getSos: () => requests.get('/admin/sos/get'),
  getsosDetails: (id) => requests.get(`/admin/sos/get?id=${id}`),
  updatesos: (sos) => requests.post('/admin/sos/update', sos),

}


export default {
  setToken,
  requests,
  getToken,
  Employees,
  Auth,
  Dashboard,
  SosPage,
  UserDetails,
  Firs,
  Nocs

};
