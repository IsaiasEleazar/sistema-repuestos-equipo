import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('taller.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error crítico al conectar SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos de Maestranza (taller.db).');
    db.run("PRAGMA foreign_keys = ON;");
  }
});

db.serialize(() => {
  // 1. Tabla: Categorías / Familias
  db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria TEXT UNIQUE NOT NULL,
    requiere_certificado INTEGER DEFAULT 0 CHECK(requiere_certificado IN (0, 1)) -- 0: No, 1: Sí
  )`);

  // 2. Tabla: Artículos (Inventario General)
  db.run(`CREATE TABLE IF NOT EXISTS articulos (
    id_articulo INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_sku TEXT UNIQUE NOT NULL,
    nombre_articulo TEXT NOT NULL,
    id_categoria INTEGER NOT NULL,
    especificacion_tecnica TEXT NOT NULL,
    unidad_medida TEXT NOT NULL,
    stock_actual INTEGER DEFAULT 0 CHECK(stock_actual >= 0),
    stock_minimo INTEGER DEFAULT 2 CHECK(stock_minimo >= 0),
    stock_maximo INTEGER DEFAULT 100 CHECK(stock_maximo >= stock_minimo),
    ubicacion_bodega TEXT NOT NULL,
    precio_costo_unitario REAL NOT NULL CHECK(precio_costo_unitario > 0),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
  )`);

  // 3. Tabla: Gestión de Retazos
  db.run(`CREATE TABLE IF NOT EXISTS retazos (
    id_retazo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_articulo_padre INTEGER NOT NULL,
    dimensiones_retazo TEXT NOT NULL,
    peso_retazo REAL NOT NULL CHECK(peso_retazo > 0),
    estado TEXT DEFAULT 'Disponible' CHECK(estado IN ('Disponible', 'Usado')),
    FOREIGN KEY (id_articulo_padre) REFERENCES articulos(id_articulo) ON DELETE CASCADE
  )`);

  // 4. Tabla: Órdenes de Trabajo (OT)
  db.run(`CREATE TABLE IF NOT EXISTS ordenes_trabajo (
    id_ot INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_ot TEXT UNIQUE NOT NULL,
    descripcion_trabajo TEXT NOT NULL,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_ot TEXT DEFAULT 'En proceso' CHECK(estado_ot IN ('En proceso', 'Pausada', 'Terminada'))
  )`);

  // 5. Tabla: Movimientos de Inventario (Kardex Técnico Automático)
  db.run(`CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_articulo INTEGER NOT NULL,
    tipo_movimiento TEXT CHECK(tipo_movimiento IN ('Entrada por compra', 'Entrada por devolución', 'Salida a producción', 'Ajuste de inventario')),
    cantidad INTEGER NOT NULL,
    id_ot INTEGER,
    id_usuario_operario TEXT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo) ON DELETE CASCADE,
    FOREIGN KEY (id_ot) REFERENCES ordenes_trabajo(id_ot) ON DELETE SET NULL
  )`);

  // Trigger de Auditoría Automática para nuevos ingresos
  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_kardex_nuevo_articulo
    AFTER INSERT ON articulos
    BEGIN
      INSERT INTO movimientos_inventario (id_articulo, tipo_movimiento, cantidad, id_usuario_operario, id_ot)
      VALUES (NEW.id_articulo, 'Entrada por compra', NEW.stock_actual, 'SISTEMA_TI', NULL);
    END;
  `);

  // Datos semilla para Categorías y OTs de producción
  const categoriasSemilla = [
    ['Materia Prima (Aceros)', 1],
    ['Consumibles (Insertos/Soldadura)', 0],
    ['Repuestos Maquinaria', 0],
    ['Herramientas de Corte', 0]
  ];
  const stmtCat = db.prepare("INSERT OR IGNORE INTO categorias (nombre_categoria, requiere_certificado) VALUES (?, ?)");
  categoriasSemilla.forEach(c => stmtCat.run(c[0], c[1]));
  stmtCat.finalize();

  const otsSemilla = [
    ['OT-2026-001', 'Fabricación de eje motriz estriado - Cliente Minera X'],
    ['OT-2026-002', 'Mecanizado de rodillos de presión - Cliente Maestranza Sur']
  ];
  const stmtOt = db.prepare("INSERT OR IGNORE INTO ordenes_trabajo (numero_ot, descripcion_trabajo) VALUES (?, ?)");
  otsSemilla.forEach(o => stmtOt.run(o[0], o[1]));
  stmtOt.finalize();
});

export default db;