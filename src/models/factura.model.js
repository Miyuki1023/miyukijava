import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  dni: { type: String, required: true, length: 8 },
  ruc: { type: String, length: 11 },
  email: { type: String, required: true },
  metodoPago: { type: String },
  nombre: { type: String, required: true },
  productos: [{
    _id: { type: String, required: true },
    title: { type: String, required: true },
    precio: { type: Number, required: true }
  }],
  precioTotal: { type: Number, default: 0 }
});

export default mongoose.model('Factura', facturaSchema);
