import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchRepuestos = (search = '') => API.get(`/repuestos?search=${search}`);
export const fetchRepuestoById = (id) => API.get(`/repuestos/${id}`);
export const fetchCategorias = () => API.get('/categorias');
export const saveRepuesto = (data) => API.post('/repuestos', data);
export const updateRepuesto = (id, data) => API.put(`/repuestos/${id}`, data);
export const deleteRepuesto = (id) => API.delete(`/repuestos/${id}`);
