import { Router } from 'express';
import { 
  getRepuestos, getRepuestoById, createRepuesto, 
  updateRepuesto, deleteRepuesto, getCategorias 
} from '../controllers/repuestosController.js';

const router = Router();

router.get('/repuestos', getRepuestos);
router.get('/repuestos/:id', getRepuestoById);
router.get('/categorias', getCategorias);
router.post('/repuestos', createRepuesto);
router.put('/repuestos/:id', updateRepuesto);
router.delete('/repuestos/:id', deleteRepuesto);

export default router;
