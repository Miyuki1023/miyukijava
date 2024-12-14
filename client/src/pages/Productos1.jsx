import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, FormControl, FormHelperText, Input, InputLabel, Button, Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { productoSchema } from "../schemas/producto.schema"; // Suponiendo que tienes un esquema de validación
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducto } from '../context/ProductoContext'; // Asegúrate de tener este contexto configurado
import toast from 'react-hot-toast';

export default function ProductosForm() {
  const { createProducto, editProducto, deleteProducto, getTodosProductos, productos } = useProducto();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productoSchema),
  });

  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [productoId, setProductoId] = useState(null); // Para editar

  useEffect(() => {
    // Cargar productos si es necesario
    getTodosProductos();
  }, [getTodosProductos]);

  const onSubmit = async (data) => {
    setLoading(true);

    const productoData = {
      nombre: data.nombre,
      precio: parseFloat(data.precio),
      categoria: categoria,
    };

    try {
      if (productoId) {
        await editProducto(productoId, productoData); // Editar producto si tiene un ID
        toast.success("Producto editado correctamente");
      } else {
        await createProducto(productoData); // Crear un nuevo producto
        toast.success("Producto creado exitosamente");
      }
      // Limpiar formulario después de enviar
      setNombre('');
      setPrecio('');
      setCategoria('');
      setProductoId(null);
    } catch (error) {
      console.error("Error al procesar el producto", error);
      toast.error("Hubo un error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const productoToEdit = productos.find((p) => p._id === id);
    if (productoToEdit) {
      setProductoId(id);
      setNombre(productoToEdit.nombre);
      setPrecio(productoToEdit.precio);
      setCategoria(productoToEdit.categoria);
    }
  };

  const handleDelete = (id) => {
    deleteProducto(id);
    toast.success("Producto eliminado");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: '600px', margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>{productoId ? 'Editar Producto' : 'Crear Producto'}</Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel htmlFor="nombre">Nombre del Producto</InputLabel>
        <Input 
          id="nombre" 
          {...register("nombre", { required: "Este campo es obligatorio" })} 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} 
        />
        {errors.nombre && <FormHelperText error>{errors.nombre.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel htmlFor="precio">Precio</InputLabel>
        <Input 
          id="precio" 
          {...register("precio", { required: "Este campo es obligatorio" })}
          value={precio}
          onChange={(e) => setPrecio(e.target.value)} 
        />
        {errors.precio && <FormHelperText error>{errors.precio.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <MenuItem value="Manicure Spa">Manicure Spa</MenuItem>
          <MenuItem value="Aromaterapia">Aromaterapia</MenuItem>
          <MenuItem value="Diseños">Diseños</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </Button>

      {/* Tabla de productos */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(producto._id)}>Editar</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(producto._id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
