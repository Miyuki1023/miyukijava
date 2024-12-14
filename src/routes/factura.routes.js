import { Router } from 'express'
import { 
    createFactura, 
    getFacturas, 
    getFacturaById, 
  updateFactura, 
  deleteFactura 
} from '../controllers/factura.controller.js';

const router = Router();

router.post('/facturas', createFactura);
router.get('/facturas', getFacturas);
router.get('/facturas/:id', getFacturaById);
router.put('/facturas/:id', updateFactura);
router.delete('/facturas/:id', deleteFactura);

export default router;
