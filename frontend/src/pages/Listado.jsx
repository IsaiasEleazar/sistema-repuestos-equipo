import { useEffect, useState } from 'react';
import { fetchRepuestos, deleteRepuesto } from '../services/api';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StockBadge } from '../components/StockBadge';
import { ErrorMessage } from '../components/ErrorMessage';

export const Listado = () => {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Estados para métricas calculadas en tiempo real
  const [metrics, setMetrics] = useState({
    totalItems: 0,
    totalInversion: 0,
    itemsCriticos: 0,
    totalFamilias: 0
  });

  const load = async () => {
    try {
      const res = await fetchRepuestos(search);
      const data = res.data;
      setArticulos(data);

      // ESTRUCTURA INTEGRADA: Cálculo analítico de KPI en tiempo real
      const total = data.length;
      
      const inversion = data.reduce((acc, curr) => {
        return acc + (curr.stock_actual * curr.precio_costo_unitario);
      }, 0);

      const criticos = data.filter(item => item.stock_actual <= item.stock_minimo).length;
      
      const familiasUnicas = new Set(data.map(item => item.id_categoria)).size;

      setMetrics({
        totalItems: total,
        totalInversion: inversion,
        itemsCriticos: criticos,
        totalFamilias: familiasUnicas
      });

    } catch (err) { 
      setError(err.message || 'Falla del núcleo central de datos.'); 
    }
  };

  useEffect(() => { load(); }, [search]);

  return (
    <div style={styles.container}>
      {/* Encabezado Principal */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>🛸 INVENTORY MANAGEMENT OVERVIEW</h2>
          <p style={styles.subtitle}>Supervisión de terminales de bodega, componentes metalmecánicos y analítica de planta</p>
        </div>
        <Link to="/nuevo" style={styles.addBtn}>+ INITIALIZE MATERIAL</Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* 📊 BLOQUE DE MÉTRICAS INTEGRADAS SUPERIORES (Estilo Dashboard Real) */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricTitle}>TOTAL ITEMS INDEXADOS</span>
            <span style={{ ...styles.metricIcon, color: '#06b6d4' }}>📦</span>
          </div>
          <div style={styles.metricValue}>{metrics.totalItems}</div>
          <div style={styles.metricSubtext}>Códigos SKU activos en base de datos</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricTitle}>VALOR TOTAL DE BODEGA</span>
            <span style={{ ...styles.metricIcon, color: '#a855f7' }}>💰</span>
          </div>
          <div style={styles.metricValue}>S/. {metrics.totalInversion.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={styles.metricSubtext}>Capital financiero inmovilizado en stock</div>
        </div>

        <div style={styles.metricCard}>
          <div style={{ ...styles.metricCardAlert, display: metrics.itemsCriticos > 0 ? 'block' : 'none' }} />
          <div style={styles.metricHeader}>
            <span style={styles.metricTitle}>ALERTAS CRÍTICAS (REORDEN)</span>
            <span style={{ ...styles.metricIcon, color: '#ef4444' }}>🛑</span>
          </div>
          <div style={{ ...styles.metricValue, color: metrics.itemsCriticos > 0 ? '#f87171' : '#22d3ee' }}>{metrics.itemsCriticos}</div>
          <div style={styles.metricSubtext}>Artículos bajo o igual al stock mínimo técnico</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricTitle}>FAMILIAS MECÁNICAS</span>
            <span style={{ ...styles.metricIcon, color: '#10b981' }}>📐</span>
          </div>
          <div style={styles.metricValue}>{metrics.totalFamilias}</div>
          <div style={styles.metricSubtext}>Categorías relacionales en producción</div>
        </div>
      </div>

      {/* Tabla Maestra Contenedora */}
      <div style={styles.card}>
        <SearchBar onSearch={setSearch} />
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PREVIEW</th>
                <th style={styles.th}>TRACK_ID / SKU</th>
                <th style={styles.th}>MATERIAL_NAME</th>
                <th style={styles.th}>SPECIFICATION</th>
                <th style={styles.th}>FAMILY</th>
                <th style={styles.th}>QUANTITY</th>
                <th style={styles.th}>UNIT_PRICE</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>OPERATIONS</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length === 0 ? (
                <tr><td colSpan="8" style={styles.emptyRow}>Ningún registro activo indexado en la matriz.</td></tr>
              ) : (
                articulos.map(a => (
                  <tr key={a.id_articulo} style={styles.tr}>
                    <td style={styles.td}>
                      {a.imagen_url ? (
                        <img src={a.imagen_url} alt="Insumo" style={styles.thumbImage} onError={(e)=>{e.target.style.display='none'}} />
                      ) : (
                        <div style={styles.thumbFallback}>⚛️</div>
                      )}
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#06b6d4', letterSpacing: '0.5px' }}>{a.codigo_sku}</td>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#f8fafc' }}>{a.nombre_articulo}</td>
                    <td style={styles.td}><code style={styles.codeText}>{a.especificacion_tecnica}</code></td>
                    <td style={styles.td}><span style={styles.catTag}>{a.nombre_categoria}</span></td>
                    <td style={styles.td}>
                      <StockBadge actual={a.stock_actual} minimo={a.stock_minimo} />
                      <span style={{fontSize:'12px', color:'#64748b', marginLeft:'6px'}}>({a.unidad_medida})</span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#a855f7' }}>S/. {a.precio_costo_unitario.toFixed(2)}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={styles.actionGroup}>
                        <Link to={`/repuesto/${a.id_articulo}`} style={styles.editLink}>EDIT</Link>
                        <button onClick={async () => { if(window.confirm('¿Purgar registro?')) { await deleteRepuesto(a.id_articulo); load(); } }} style={styles.deleteBtn}>DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', padding: '0 40px', boxSizing: 'border-box' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { margin: 0, color: '#f8fafc', fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px' },
  subtitle: { margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' },
  addBtn: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(16,185,129,0.25)' },
  
  /* RESTRUCTURACIÓN: Diseño de la rejilla de KPIs superiores */
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' },
  metricCard: { background: '#131c2e', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  metricCardAlert: { position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' },
  metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  metricTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' },
  metricIcon: { fontSize: '16px' },
  metricValue: { fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px', fontFamily: 'var(--sans)' },
  metricSubtext: { fontSize: '12px', color: '#64748b' },

  card: { background: '#131c2e', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', width: '100%', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  tableWrapper: { overflowX: 'auto', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px', background: '#0f172a', color: '#94a3b8', fontWeight: '700', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #1e293b' },
  tr: { borderBottom: '1px solid #1e293b' },
  td: { padding: '14px 16px', color: '#cbd5e1', fontSize: '14px', verticalAlign: 'middle' },
  thumbImage: { width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #334155' },
  thumbFallback: { width: '42px', height: '42px', borderRadius: '6px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid #334155' },
  codeText: { background: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#f8fafc', border: '1px solid #1e293b', fontFamily: 'var(--mono)' },
  catTag: { background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(168,85,247,0.3)' },
  emptyRow: { textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' },
actionGroup: { display: 'flex', gap: '8px', justifyContent: 'center' },
editLink: { color: '#22d3ee', textDecoration: 'none', fontWeight: '700', fontSize: '12px', padding: '6px 14px', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '6px', background: 'rgba(6,182,212,0.05)' },
deleteBtn: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }
};