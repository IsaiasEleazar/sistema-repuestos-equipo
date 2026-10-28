import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 8000, 
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = {
      message: 'Ocurrió un error inesperado al gestionar el inventario.',
      code: 'UNKNOWN_ERROR',
      status: error.response ? error.response.status : 0
    };

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        customError.message = '⏱️ Tiempo de espera agotado. El servidor del taller tarda demasiado en responder.';
        customError.code = 'TIMEOUT_ERROR';
      } else {
        customError.message = '🔌 El servidor de Soporte TI no responde. Verifique que el backend esté encendido (npm run dev).';
        customError.code = 'SERVER_OFFLINE';
      }
      return Promise.reject(customError);
    }

    const { status, data } = error.response;

    if (data && data.error) {
      customError.message = data.error;
      customError.code = data.code || 'API_ERROR';
      return Promise.reject(customError);
    }

    switch (status) {
      case 400:
        customError.message = '❌ Los datos enviados no cumplen con los requisitos de validación.';
        customError.code = 'BAD_REQUEST';
        break;
      case 404:
        customError.message = '🔍 El componente o endpoint solicitado no existe en la base de datos del taller.';
        customError.code = 'NOT_FOUND';
        break;
      case 409:
        customError.message = '⚠️ Conflicto de datos: El registro no puede alterarse por dependencias activas.';
        customError.code = 'CONFLICT';
        break;
      case 500:
        customError.message = '💥 Error crítico interno en la base de datos SQLite.';
        customError.code = 'INTERNAL_SERVER_ERROR';
        break;
      default:
        customError.message = `Falla técnica no controlada: Código HTTP ${status}`;
        customError.code = 'UNHANDLED_HTTP_STATUS';
    }

    return Promise.reject(customError);
  }
);

export const fetchRepuestos = (search = '') => API.get(`/repuestos?search=${search}`);
export const fetchRepuestoById = (id) => API.get(`/repuestos/${id}`);
export const fetchCategorias = () => API.get('/categorias');
export const saveRepuesto = (data) => API.post('/repuestos', data);
export const updateRepuesto = (id, data) => API.put(`/repuestos/${id}`, data);
export const deleteRepuesto = (id) => API.delete(`/repuestos/${id}`);