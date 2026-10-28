import db from '../db/db.js';

export const getRepuestos = (req, res, next) => {
  const { search } = req.query;
  let query = `SELECT a.*, c.nombre_categoria, c.requiere_certificado 
               FROM articulos a 
               INNER JOIN categorias c ON a.id_categoria = c.id_categoria`;
  let params = [];

  if (search) {
    query += ` WHERE a.nombre_articulo LIKE ? OR a.codigo_sku LIKE ? OR a.especificacion_tecnica LIKE ?`;
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  db.all(query, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
};

export const getRepuestoById = (req, res, next) => {
  const { id } = req.params;
  db.get(`SELECT * FROM articulos WHERE id_articulo = ?`, [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Artículo no localizado en almacén.' });
    res.json(row);
  });
};

export const createRepuesto = (req, res, next) => {
  const { codigo_sku, nombre_articulo, id_categoria, especificacion_tecnica, unidad_medida, stock_actual, stock_minimo, stock_maximo, ubicacion_bodega, precio_costo_unitario } = req.body;
  const query = `INSERT INTO articulos (codigo_sku, nombre_articulo, id_categoria, especificacion_tecnica, unidad_medida, stock_actual, stock_minimo, stock_maximo, ubicacion_bodega, precio_costo_unitario) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [codigo_sku, nombre_articulo, id_categoria, especificacion_tecnica, unidad_medida, stock_actual, stock_minimo, stock_maximo, ubicacion_bodega, precio_costo_unitario], function (err) {
    if (err) return next(err);
    res.status(201).json({ id: this.lastID, ...req.body });
  });
};

export const updateRepuesto = (req, res, next) => {
  const { id } = req.params;
  const { codigo_sku, nombre_articulo, id_categoria, especificacion_tecnica, unidad_medida, stock_actual, stock_minimo, stock_maximo, ubicacion_bodega, precio_costo_unitario } = req.body;

  const query = `UPDATE articulos SET codigo_sku = ?, nombre_articulo = ?, id_categoria = ?, especificacion_tecnica = ?, 
                 unidad_medida = ?, stock_actual = ?, stock_minimo = ?, stock_maximo = ?, ubicacion_bodega = ?, precio_costo_unitario = ? WHERE id_articulo = ?`;
  db.run(query, [codigo_sku, nombre_articulo, id_categoria, especificacion_tecnica, unidad_medida, stock_actual, stock_minimo, stock_maximo, ubicacion_bodega, precio_costo_unitario, id], function (err) {
    if (err) return next(err);
    res.json({ message: 'Maestro de materiales actualizado correctamente.' });
  });
};

export const deleteRepuesto = (req, res, next) => {
  const { id } = req.params;
  db.run(`DELETE FROM articulos WHERE id_articulo = ?`, [id], function (err) {
    if (err) return next(err);
    res.status(204).end();
  });
};

export const getCategorias = (req, res, next) => {
  db.all("SELECT * FROM categorias ORDER BY nombre_categoria ASC", [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
};