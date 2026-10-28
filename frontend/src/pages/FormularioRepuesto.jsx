import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormError } from 'formik';
import * as Yup from 'yup';
import { fetchCategorias, fetchRepuestoById, saveRepuesto, updateRepuesto } from '../services/api';
import { ErrorMessage } from '../components/ErrorMessage';

export const FormularioRepuesto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [initialValues, setInitialValues] = useState({
    codigo: '', nombre: '', categoria_id: '', stock_actual: 0, stock_minimo: 5, precio: '', ubicacion: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategorias().then(res => setCategorias(res.data)).catch(() => setError('Error al cargar categorías'));
    if (id) {
      fetchRepuestoById(id).then(res => setInitialValues(res.data)).catch(() => setError('Error al recuperar repuesto'));
    }
  }, [id]);

  const validationSchema = Yup.object({
    codigo: Yup.string().required('El código SKU es obligatorio'),
    nombre: Yup.string().required('El nombre es obligatorio'),
    precio: Yup.number().positive('Debe ser un precio mayor a 0').required('El precio es obligatorio'),
    stock_actual: Yup.number().integer().min(0, 'No puede ser negativo'),
    stock_minimo: Yup.number().integer().min(0, 'No puede ser negativo')
  });

  const onSubmit = async (values) => {
    try {
      if (id) await updateRepuesto(id, values);
      else await saveRepuesto(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>{id ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}</h2>
      {error && <ErrorMessage message={error} />}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {() => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label>Código SKU:</label>
              <Field name="codigo" style={{ width: '100%', padding: '5px' }} />
              <FormError name="codigo" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Nombre del Repuesto:</label>
              <Field name="nombre" style={{ width: '100%', padding: '5px' }} />
              <FormError name="nombre" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Categoría:</label>
              <Field as="select" name="categoria_id" style={{ width: '100%', padding: '5px' }}>
                <option value="">-- Seleccione --</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Field>
            </div>
            <div>
              <label>Precio (S/.):</label>
              <Field type="number" name="precio" style={{ width: '100%', padding: '5px' }} />
              <FormError name="precio" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Stock Actual:</label>
              <Field type="number" name="stock_actual" style={{ width: '100%', padding: '5px' }} />
            </div>
            <div>
              <label>Stock Mínimo Alerta:</label>
              <Field type="number" name="stock_minimo" style={{ width: '100%', padding: '5px' }} />
            </div>
            <div>
              <label>Ubicación Almacén (Ej: Estante A):</label>
              <Field name="ubicacion" style={{ width: '100%', padding: '5px' }} />
            </div>
            <button type="submit" style={{ padding: '10px', background: 'green', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Guardar Repuesto
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
