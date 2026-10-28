# 🛸 CORE INVENTORY // Sistema Avanzado de Gestión de Almacén y Maestranza

[![Stack](https://shields.io)](#)
[![SENATI](https://shields.io)](#)
[![Database](https://shields.io)](#)

## 📋 Información del Proyecto
* **Carrera:** Ingeniería de Software con Inteligencia Artificial
* **Nivel / Ciclo:** V Ciclo · CFP Huaraz · SENATI
* **Unidad de Aprendizaje:** Tecnología Frontend con JavaScript / React
* **Instructor:** Ing. Carlos Alberto Durán Cueva
* **Semana:** 11 (9 Retos de Desarrollo Web)
* **Proyecto Desarrollado:** Reto 06 - Inventario de repuestos de taller (Evolucionado a Control de Maestranza)
* **Modalidad:** Trabajo del Equipo de Desarrollo

---

## 🚀 Alcance e Integración del MVP Avanzado
Este sistema resuelve el control patrimonial, el flujo físico de existencias y la trazabilidad técnica en una maestranza metalmecánica o taller de mecanizado mediante una aplicación web de una sola página (**SPA**). 

A diferencia de un listado básico tradicional, este software implementa una **interfaz futurista Dark Mode fluida (Full Width)** que integra indicadores analíticos automatizados (KPIs), control multimedia de piezas mediante URLs de imágenes e interceptores de red para mitigar fallas críticas de infraestructura.

---

## 🛠️ Stack Tecnológico Utilizado
* **Frontend:** React 19 (Vite), React Router DOM (Navegación SPA), Axios (Llamadas HTTP asíncronas), Formik y Yup (Validación estricta de formularios).
* **Backend:** Node.js, Express (API REST estructurada), CORS Middleware.
* **Persistencia:** Base de datos relacional SQLite a través del archivo local inmutable `taller.db`.
* **Control de Versiones:** Git y GitHub corporativo para el despliegue del repositorio.

---

## 🗄️ Arquitectura del Modelo de Datos (5 Tablas Relacionales)
1. **Categorías / Familias (`categorias`):** `id_categoria` (PK), `nombre_categoria`, `requiere_certificado` (Control estricto de calidad de aceros estructurales).
2. **Artículos / Maestro de Materiales (`articulos`):** `id_articulo` (PK), `codigo_sku` (Único), `nombre_articulo`, `id_categoria` (FK), `especificacion_tecnica` (Normas como SAE 4140, SAE 1045), `unidad_medida` (Kg, Metros, Unidades), `stock_actual`, `stock_minimo`, `stock_maximo` (Límite financiero), `ubicacion_bodega`, `precio_costo_unitario`, `imagen_url` (Multimedia de referencia).
3. **Gestión de Retazos (`retazos`):** `id_retazo` (PK), `id_articulo_padre` (FK), `dimensiones_retazo`, `peso_retazo`, `estado` (Para evitar el desperdicio de barras de aceros costosas).
4. **Órdenes de Trabajo (`ordenes_trabajo`):** `id_ot` (PK), `numero_ot` (Único), `descripcion_trabajo`, `fecha_apertura`, `estado_ot` (Justificación de la salida de materiales a producción).
5. **Movimientos de Inventario / Kardex (`movimientos_inventario`):** `id_movimiento` (PK), `id_articulo` (FK), `tipo_movimiento`, `cantidad`, `id_ot` (FK), `id_usuario_operario`, `fecha_hora`.

---

## 🛣️ Contrato de Endpoints de la API REST
* `GET /api/repuestos` ➔ Obtiene el maestro completo uniendo tablas relacionales con soporte de búsquedas reactivas.
* `GET /api/repuestos/:id` ➔ Recupera la ficha técnica y la imagen de un único artículo por ID (Ruta dinámica).
* `POST /api/repuestos` ➔ Registra un insumo procesando restricciones financieras en el servidor.
* `PUT /api/repuestos/:id` ➔ Actualiza los valores técnicos y de stock del componente.
* `DELETE /api/repuestos/:id` ➔ Da de baja física al artículo en la base de datos local.
* `GET /api/categorias` ➔ Suministra las familias del catálogo semilla ordenadas alfabéticamente.
* `GET /api/health` ➔ Monitor de disponibilidad y estado técnico de la API.

---

## 🛡️ Características de Mitigación ante Fallas Críticas
* **Bloqueo Anti-Caídas Global:** Middleware centralizado en Express que intercepta errores síncronos/asíncronos del motor SQLite y los traduce a respuestas limpias JSON, evitando que el backend sufra colapsos (`crashes`).
* **Cierre Seguro (Graceful Shutdown):** El backend intercepta señales de apagado de consola (`Ctrl + C`) bloqueando nuevas entradas y clausurando la base de datos sin corrupción de archivos estáticos.
* **Escudo de Red (Axios Interceptors):** Captura de forma inmediata caídas en la conexión o servidores offline, notificando claramente al operario en pantalla en lugar de congelar la aplicación web.
* **Control de Concurrencia Duplicada:** Bloqueo dinámico de botones de acción (`isSubmitting`) en Formik para impedir registros mellizos debido a clics repetidos en la interfaz.

---

## 🔧 Instrucciones de Instalación y Despliegue Técnico

### 1. Clonar el repositorio oficial
```bash
git clone https://github.com
cd sistema-repuestos-equipo
```

### 2. Inicializar la infraestructura del Servidor (Backend)
```bash
cd backend
npm install
npm run dev
```
*El núcleo levantará automáticamente en http://localhost:5000 y compilará la base de datos relacional taller.db en frío.*

### 3. Inicializar la Terminal Digital de Bodega (Frontend)
```bash
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```
*Abre http://localhost:5173 en Google Chrome para operar la plataforma a pantalla completa.*