import express from 'express';
import cors from 'cors';
import router from './routes/repuestosRoutes.js';
import db from './db/db.js'; 

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[🚀 API LOG] ${new Date().toISOString()} - ${req.method} a ${req.url}`);
  next();
});

app.use('/api', router);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'API disponible y corriendo',
    database: 'CONNECTED',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    error: 'El recurso o endpoint solicitado no existe en el servidor de soporte TI.',
    code: 'NOT_FOUND_ENDPOINT',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error(`[🚨 CRITICAL ERROR] Detectado en flujo:`, err.stack || err.message);

  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(409).json({
      error: 'Conflicto de integridad: No se puede borrar la categoría porque contiene repuestos activos.',
      code: 'INTEGRITY_CONSTRAINT_VIOLATION'
    });
  }

  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(400).json({
      error: 'Restricción de duplicados: El código SKU patrimonial ya se encuentra asignado a otro repuesto.',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (err.message && err.message.includes('CHECK constraint failed')) {
    return res.status(400).json({
      error: 'Validación de Servidor: Los valores numéricos no cumplen con los límites mínimos (Precios o stock menores a cero).',
      code: 'VALUE_CONSTRAINT_VIOLATION'
    });
  }

  res.status(500).json({
    error: 'Ocurrió una falla imprevista en el servidor del taller.',
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor de soporte TI corriendo en http://localhost:${PORT}`);
});

const cerrarServidorLimpio = (signal) => {
  console.log(`\n[🛑 APAGADO] Recibida señal ${signal}. Cerrando conexiones de forma segura...`);
  server.close(() => {
    console.log('📦 Servidor Express detenido.');
    db.close((err) => {
      if (err) console.error('Error al cerrar SQLite:', err.message);
      else console.log('🗄️ Conexión con taller.db clausurada correctamente.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => cerrarServidorLimpio('SIGINT'));
process.on('SIGTERM', () => cerrarServidorLimpio('SIGTERM'));