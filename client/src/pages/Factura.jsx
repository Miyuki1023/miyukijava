import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, Input, Button, Select, MenuItem, FormHelperText, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { facturaSchema } from '../../../src/schemas/factura.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import IconButton from '@mui/material/IconButton'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFactura } from '../context/FacturaContext';

const FacturaForm = () => {
    const navigate = useNavigate();
    const { createFactura } = useFactura();

    const productos = [
        {
            _id: '675438ba8f0176c7280bf0f6',
            tipo: 'Manicure Spa',
            title: 'Manicura Pedicure Combinada',
            description: '¡El combo perfecto! Disfruta de un tratamiento completo de manos y pies.',
            categoria: 'Bodas',
            precio: 80
        },
        {
            _id: '675438cd8f0176c7280bf0f8',
            tipo: 'Manicure Spa',
            title: 'Manicura con Diseño Artístico',
            description: 'Agrega un toque único a tus manos con un diseño personalizado.',
            categoria: 'Clasicas',
            precio: 80
        },
        {
            _id: '675438ee8f0176c7280bf0fa',
            tipo: 'Manicure Spa',
            title: 'Manicura de Aromaterapia',
            description: 'Relájate con una manicura acompañada de un baño aromático.',
            categoria: 'Clasicas',
            precio: 80
        }
    ];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(facturaSchema),
    });

    const [dni, setDni] = useState('');
    const [ruc, setRuc] = useState('');
    const [email, setEmail] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [nombre, setNombre] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [facturas, setFacturas] = useState([]);

    const agregarProducto = () => {
        if (!productoSeleccionado) {
            toast.error("Debes seleccionar un producto");
            return;
        }

        const producto = productos.find(p => p._id === productoSeleccionado);
        if (producto && !productosSeleccionados.some(p => p._id === producto._id)) {
            setProductosSeleccionados(prev => [...prev, producto]);
            setPrecioTotal(prev => prev + producto.precio);
        }
        setProductoSeleccionado('');
    };

    const eliminarProducto = (productoId) => {
        const productoEliminado = productosSeleccionados.find(p => p._id === productoId);
        if (productoEliminado) {
            setProductosSeleccionados(prev => prev.filter(p => p._id !== productoId));
            setPrecioTotal(prev => prev - productoEliminado.precio);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const facturaData = {
            nombre: data.nombre,
            dni: data.dni,
            ruc: data.ruc,
            email: data.email,
            metodoPago: metodoPago,
            productos: productosSeleccionados.map(producto => ({
                _id: producto._id,
                title: producto.title,
                precio: producto.precio
            })),
            precioTotal: precioTotal
        };

        try {
            await createFactura(facturaData); // Create factura
            toast.success("Factura creada exitosamente");

            setFacturas(prev => [...prev, facturaData]); // Update facturas state

            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            console.error("Error al crear la factura", err);
            toast.error("Ocurrió un error al crear la factura");
        } finally {
            setLoading(false);
        }
    };

    const eliminarFactura = (index) => {
        setFacturas(facturas.filter((_, i) => i !== index)); // Remove factura from list
        toast.success("Factura eliminada");
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#f5f5f5', borderRadius: '8px', maxWidth: '700px', margin: 'auto' }} noValidate autoComplete="off">
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 3 }}>Crear Factura</Typography>

            {/* Formulario */}
            <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="nombre">Nombre del Cliente</InputLabel>
                <Input id="nombre" {...register("nombre", { required: "Este campo es obligatorio" })} error={!!errors.nombre} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                {errors.nombre && <FormHelperText error>{errors.nombre.message}</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="dni">DNI</InputLabel>
                <Input id="dni" {...register("dni", { required: "Este campo es obligatorio" })} error={!!errors.dni} value={dni} onChange={(e) => setDni(e.target.value)} />
                {errors.dni && <FormHelperText error>{errors.dni.message}</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="ruc">RUC</InputLabel>
                <Input id="ruc" {...register("ruc", { required: "Este campo es obligatorio" })} error={!!errors.ruc} value={ruc} onChange={(e) => setRuc(e.target.value)} />
                {errors.ruc && <FormHelperText error>{errors.ruc.message}</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" {...register("email", { required: "Este campo es obligatorio" })} error={!!errors.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </FormControl>

            {/* Selección de Producto */}
            <FormControl fullWidth variant="standard">
                <InputLabel>Producto</InputLabel>
                <Select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
                    {productos.map((producto) => (
                        <MenuItem key={producto._id} value={producto._id}>
                            {producto.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" onClick={agregarProducto}>Agregar Producto</Button>

            {/* Tabla de Productos Seleccionados */}
            <TableContainer component={Paper} sx={{ maxHeight: 400, marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="productos seleccionados">
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Precio</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productosSeleccionados.map((factura) => (
                            <TableRow key={factura._id}>
                                <TableCell component="th" scope="row">{factura.title}</TableCell>
                                <TableCell align="right">${factura.precio}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => eliminarProducto(factura._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Precio Total */}
            <Typography variant="h6" sx={{ marginTop: 2 }}>Precio Total: {precioTotal}</Typography>

            <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Cargando...' : 'Crear Factura'}
            </Button>

            {/* Tabla de Facturas */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>DNI</TableCell>
                            <TableCell>RUC</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Productos</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facturas.map((factura, index) => (
                            <TableRow key={index}>
                                <TableCell>{factura.nombre}</TableCell>
                                <TableCell>{factura.dni}</TableCell>
                                <TableCell>{factura.ruc}</TableCell>
                                <TableCell>{factura.email}</TableCell>
                                <TableCell>{factura.productos.map(p => p.title).join(", ")}</TableCell>
                                <TableCell>{factura.precioTotal}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="secondary" size="small" onClick={() => editarProducto(factura._id)}>Editar</Button>
                                    <IconButton onClick={() => eliminarFactura(index)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FacturaForm;
