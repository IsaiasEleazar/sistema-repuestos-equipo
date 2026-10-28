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
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    codigo_sku: '', nombre_articulo: '', id_categoria: '', especificacion_tecnica: '', unidad_medida: 'Unidades', stock_actual: 0, stock_minimo: 2, stock_maximo: 50, ubicacion_bodega: '', precio_costo_unitario: ''
  });

  useEffect(() => {
    fetchCategorias().then(res => setCategorias(res.data)).catch(err => setError(err.message));
    if (id) {
      fetchRepuestoById(id).then(res => setInitialValues(res.data)).catch(err => setError(err.message));
    }
  }, [id]);

  const validationSchema = Yup.object({
    codigo_sku: Yup.string().required('⚠️ El código SKU de trazabilidad es obligatorio.'),
    nombre_articulo: Yup.string().required('⚠️ El nombre del material es obligatorio.'),
    id_categoria: Yup.string().required('⚠️ Seleccione la familia metalmecánica.'),
    especificacion_tecnica: Yup.string().required('⚠️ Indique la norma o aleación técnica (Ej: SAE 1045).'),
    ubicacion_bodega: Yup.string().required('⚠️ Defina la ubicación en la bodega de maestranza.'),
    precio_costo_unitario: Yup.number().positive('Debe ser mayor a 0').required('⚠️ Ingrese el precio de costo.'),
    stock_actual: Yup.number().integer().min(0, 'No negativo'),
    stock_minimo: Yup.number().integer().min(0, 'No negativo'),
    stock_maximo: Yup.number().integer().min(1, 'Mínimo 1')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      if (id) await updateRepuesto(id, values);
      else await saveRepuesto(values);
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>{id ? '✏️ Ficha Técnica - Regularizar Material' : '🛠️ Ficha Técnica - Ingreso de Materiales'}</h2>
        <p style={styles.subtitle}>Registro maestro homologado bajo normas e inventariado de producción</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={styles.card}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form style={styles.form}>
              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Código SKU / Registro Único</label>
                  <Field name="codigo_sku" placeholder="Ej: MAT-4140-3" style={styles.input} disabled={!!id} />
                  <FormError name="codigo_sku" component="div" style={styles.errorText} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Nombre Genérico del Artículo</label>
                  <Field name="nombre_articulo" placeholder="Ej: Barra cilíndrica de acero" style={styles.input} />
                  <FormError name="nombre_articulo" component="div" style={styles.errorText} />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Familia / Tipo de Material</label>
                  <Field as="select" name="id_categoria" style={styles.input}>
                    <option value="">-- Seleccione Familia --</option>
                    {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria} {c.requiere_certificado === 1 && '(⚠️ Requiere Certificado)'}</option>)}
                  </Field>
                  <FormError name="id_categoria" component="div" style={styles.errorText} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Especificación Técnica / Aleación / Medida Básica</label>
                  <Field name="especificacion_tecnica" placeholder="Ej: Diámetro 3 pulgadas x 6 metros SAE 4140" style={styles.input} />
                  <FormError name="especificacion_tecnica" component="div" style={styles.errorText} />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Unidad de Despacho</label>
                  <Field as="select" name="unidad_medida" style={styles.input}>
                    <option value="Unidades">Unidades</option>
                    <option value="Kilogramos">Kilogramos</option>
                    <option value="Metros">Metros</option>
                    <option value="Planchas">Planchas</option>
                  </Field>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Último Precio Costo Unitario (S/.)</label>
                  <Field type="number" step="0.01" name="precio_costo_unitario" placeholder="0.00" style={styles.input} />
                  <FormError name="precio_costo_unitario" component="div" style={styles.errorText} />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Stock Actual en Bodega</label>
                  <Field type="number" name="stock_actual" style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Stock Mínimo (Umbral de Alerta)</label>
                  <Field type="number" name="stock_minimo" style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Stock Máximo Financiero</label>
                  <Field type="number" name="stock_maximo" style={styles.input} />
                </div>
              </div>

              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>Ubicación Física Exacta (Pasillo / Celda / Estante)</label>
                <Field name="ubicacion_bodega" placeholder="Ej: Zona A - Estante 4 - Nivel 2" style={styles.input} />
                <FormError name="ubicacion_bodega" component="div" style={styles.errorText} />
              </div>

              <div style={styles.buttonGroup}>
                <button type="button" onClick={() => navigate('/')} style={styles.cancelBtn} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" style={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? '⚙️ Procesando Kardex...' : id ? 'Modificar Registro' : 'Ingresar a Bodega'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Reemplazar la constante styles al final de frontend/src/pages/FormularioRepuesto.jsx
const styles = {
  // Ajustado a contenedor fluido sin bordes fantasmas
  container: { 
    fontFamily: "var(--sans)", 
    width: '100%', 
    padding: '0 40px', 
    boxSizing: 'border-box' 
  },
  headerRow: { marginBottom: '25px' },
  title: { margin: 0, color: '#f8fafc', fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px' },
  subtitle: { margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' },
  
  /* TARJETA CYBERPUNK INTEGRADA (Solución al fondo blanco) */
  card: { 
    background: '#131c2e',             /* Fondo oscuro unificado con el ecosistema */
    padding: '35px', 
    borderRadius: '12px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
    border: '1px solid #1e293b',       /* Borde imperceptible de alta fidelidad */
    width: '100%', 
    boxSizing: 'border-box' 
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  rowLayout: { display: 'flex', gap: '35px' },
  row: { display: 'flex', gap: '20px', width: '100%' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  fieldGroupFull: { display: 'flex', flexDirection: 'column', gap: '6px' },
  
  /* TEXTOS DE ETIQUETAS ILUMINADOS */
  label: { fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '4px' },
  
  /* Sincronización con el index.css para entradas limpias */
  input: { 
    padding: '12px 14px', 
    fontSize: '14px', 
    border: '1px solid #334155', 
    borderRadius: '6px', 
    outline: 'none',
    color: '#f8fafc',
    background: '#0f172a'
  },
  errorText: { color: '#f87171', fontSize: '12px', fontWeight: '500', marginTop: '2px' },
  previewBox: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' },
  
  /* MARCO MULTIMEDIA AVANZADO */
  imageFrame: { 
    width: '100%', 
    height: '240px', 
    background: '#0f172a', 
    border: '2px dashed #334155', 
    borderRadius: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'contain' },
  noImageText: { textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: '500', lineHeigh: '1.5' },
  
  /* SECCIÓN DE ACCIONES TÉCNICAS */
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid #1e293b', paddingTop: '20px' },
  cancelBtn: { background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '11px 22px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: '0.2s' },
  submitBtn: { background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none', color: '#fff', padding: '11px 26px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 15px rgba(6,182,212,0.25)', transition: '0.2s' },
  submitBtnDisabled: { background: '#1e293b', border: 'none', color: '#64748b', padding: '11px 26px', borderRadius: '6px', cursor: 'not-allowed' }
};