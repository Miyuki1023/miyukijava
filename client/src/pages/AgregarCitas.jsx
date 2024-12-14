import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Input, FormHelperText } from '@mui/material';
import { useCitas } from '../context/CitaContext';
import { citaSchema } from '../../../src/schemas/cita.schema';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const productosOptions = [
  { id: '675438a68f0176c7280bf0f4', title: 'Manicura de Gel', precio: 60 },
  { id: '675438ba8f0176c7280bf0f6', title: 'Manicura Pedicure Combinada', precio: 80 },
  { id: '675438cd8f0176c7280bf0f8', title: 'Manicura con Diseño Artístico', precio: 80 },
  { id: '675438ee8f0176c7280bf0fa', title: 'Manicura de Aromaterapia', precio: 80 },
  { id: '6754390f8f0176c7280bf0fc', title: 'Manicura Rusa', precio: 80 },
  { id: '67543a468f0176c7280bf652', title: 'Manicura Acrílica con Dijes de Cristales', precio: 80 },
  { id: '67543b598f0176c7280bf654', title: 'Manicura Japonesa', precio: 70 },
  { id: '67543c1a8f0176c7280bf656', title: 'Manicura Francesa', precio: 75 },
  { id: '67543cde8f0176c7280bf658', title: 'Manicura de Parafina', precio: 90 },
  { id: '67543d998f0176c7280bf65a', title: 'Manicura Efecto Mate', precio: 65 },
];

const horaOptions = [
  { value: '8:15 a 10:00' },
  { value: '10:15 a 12:00' },
  { value: '14:15 a 16:00' },
  { value: '16:15 a 18:00' },
  { value: '18:15 a 20:00' },
  { value: '20:15 a 22:00' },
];

const paymentMethods = [
  { value: 'Yape', label: 'Yape' },
  { value: 'Plin', label: 'Plin' },
  { value: 'Transferencia', label: 'Transferencia' },
];

const generateRandomAccountNumber = () => Math.floor(Math.random() * 1000000000);

export default function AgregarCitas() {
  const { createCita, updateCita, getCitas } = useCitas();
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }
  } = useForm({
    resolver: zodResolver(citaSchema),
  });

  const location = useLocation();
  const { title, description, precio, _id: diseño } = location.state || {};
  const [randomAccount, setRandomAccount] = useState(generateRandomAccountNumber());
  const [hora, setHora] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [estado, setEstado] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const handleRegresar = () => {
    navigate('/home');
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    if (event.target.value === 'Transferencia') {
      setRandomAccount(generateRandomAccountNumber());
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const citaData = {
        ...data,
        diseño: { title, description, precio },
        producto: productoSeleccionado,
      };
  
      if (params.id) {
        await updateCita(params.id, citaData); // Asegúrate que updateCita esté actualizando correctamente
        toast.success("Cita actualizada correctamente");
      } else {
        const newCita = await createCita(citaData); // Asegúrate que createCita esté agregando correctamente
        if (newCita && newCita._id) {
          toast.success("Nueva cita agregada correctamente");
        } else {
          throw new Error("No se pudo guardar la cita en la base de datos.");
        }
      }
      navigate("/home");
    } catch (error) {
      toast.error("Ocurrió un error al guardar la cita");
      console.error("Error al procesar la cita:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (params.id) {
      // Si tienes un id en los parámetros, obtén la cita para editar
      const fetchCita = async () => {
        try {
          const cita = await getCitas(params.id);  // Asegúrate que 'getCitas' pueda obtener por ID
          if (cita) {
            setValue("nombre", cita.nombre);
            setValue("celular", cita.celular);
            setValue("fecha", cita.fecha);
            setValue("hora", cita.hora);
            setValue("producto", cita.producto);
            setValue("estado", cita.estado);
          }
        } catch (error) {
          console.error('Error al cargar la cita para editar', error);
        }
      };
      fetchCita();
    }
  }, [params.id, getCitas, setValue]);
  // Asegúrate de que getCitas esté siendo llamado correctamente
  




  return (
    <Box component="form"  sx={{ p: 3, maxWidth: 700, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">Agendar Cita para Manicura</Typography>

      {/* Nombre del cliente */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="nombre">Nombre del Cliente</InputLabel>
        <Input id="nombre" {...register("nombre", { required: "Este campo es obligatorio" })} error={!!errors.nombre} />
        {errors.nombre && <FormHelperText error>{errors.nombre.message}</FormHelperText>}
      </FormControl>

      {/* Celular */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="celular">Número de Celular</InputLabel>
        <Input id="celular" {...register('celular')} error={!!errors.celular} />
        {errors.celular && <FormHelperText error>{errors.celular.message}</FormHelperText>}
      </FormControl>

      {/* Fecha */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="fecha">Fecha de la cita</InputLabel>
        <Input id="fecha" type="date" {...register("fecha")} error={!!errors.fecha} />
        {errors.fecha && <FormHelperText error>{errors.fecha.message}</FormHelperText>}
      </FormControl>

      {/* Hora */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="hora">Hora</InputLabel>
        <Select id="hora" value={hora} onChange={(event) => { setHora(event.target.value); setValue("hora", event.target.value); }} required>
          {horaOptions.map((hora, index) => (
            <MenuItem key={index} value={hora.value}>{hora.value}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Método de pago */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="paymentMethod">Método de Pago</InputLabel>
        <Select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange} required>
          {paymentMethods.map((method) => (
            <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Producto */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="producto">Producto</InputLabel>
        <Select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          required
        >
          <MenuItem value="">
            <em>Selecciona un producto</em>
          </MenuItem>
          {productosOptions.map((producto) => (
            <MenuItem key={producto.id} value={producto.id}>
              {producto.title} - {producto.precio} soles
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Estado */}
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="estado">Estado</InputLabel>
        <Select
          id="estado"
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setValue("estado", e.target.value); }}
          required
        >
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Confirmada">Confirmada</MenuItem>
          <MenuItem value="Cancelada">Cancelada</MenuItem>
        </Select>
      </FormControl>

      {/* Botones */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={handleRegresar}>Regresar</Button>
        <Button type="submit" onSubmit={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={loading}>
          {loading ? "Procesando..." : params.id ? "Actualizar Cita" : "Crear Cita"}
        </Button>
      </Box>
    </Box>
  );
}
