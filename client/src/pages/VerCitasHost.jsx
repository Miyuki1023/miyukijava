import React, { useState } from 'react';
import { Container as MuiContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'; // Importar para los botones de Editar y Eliminar

const Citas = () => {
  // Datos de citas de prueba
  const citasData = [
    {
      _id: "675d22804a7b4b4c61a79dcd",
      nombre: "Juan Pérez",
      celular: "123456789",
      fecha: "2023-12-15",
      hora: "10:15 a 12:00",
      diseño: "675438a68f0176c7280bf0f4", // ID del diseño
      estado: "Pendiente",
    },
    {
      _id: "675d22a44a7b4b4c61a79dce",
      nombre: "Juan Pérez",
      celular: "123456789",
      fecha: "2023-12-15",
      hora: "10:15 a 12:00",
      diseño: "675438ba8f0176c7280bf0f6", // Otro ID de diseño
      estado: "Cancelada",
    },
  ];

  // Opciones de productos (diseños)
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
    { id: '67543d998f0176c7280bf65a', title: 'Manicura Efecto Mate', precio: 65 }
  ];

  // Función para obtener el diseño (title y precio) desde el ID
  const obtenerDiseño = (diseñoId) => {
    const producto = productosOptions.find(p => p.id === diseñoId);
    return producto ? `${producto.title} - $${producto.precio}` : 'Desconocido';
  };

  const [citas, setCitas] = useState(citasData); // Estado de las citas

  // Función para eliminar una cita
  const eliminarCita = (id) => {
    setCitas(citas.filter(cita => cita._id !== id));
  };

  // Función para editar una cita (abrir formulario con los datos de la cita)
  const editarCita = (cita) => {
    alert(`Editar cita de ${cita.nombre} - Fecha: ${cita.fecha}`);
    // Aquí podrías redirigir a un formulario de edición o abrir un modal
  };

  // Renderizado del componente
  return (
    <MuiContainer sx={{ width: '100%' }} className="Citas">
      <div id="citas">
        <div className="container">
          <main className="h22">
            <h2 className="text-center fw-bold" style={{ marginBottom: '1rem' }}>
              Lista de Citas
            </h2>

            {/* Tabla para mostrar las citas */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Celular</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Diseño</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell> {/* Nueva columna de acciones */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                        No se encontraron citas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    citas.map((cita) => (
                      <TableRow key={cita._id}>
                        <TableCell>{cita.nombre}</TableCell>
                        <TableCell>{cita.celular}</TableCell>
                        <TableCell>{cita.fecha}</TableCell>
                        <TableCell>{cita.hora}</TableCell>
                        <TableCell>{obtenerDiseño(cita.diseño)}</TableCell>
                        <TableCell>{cita.estado}</TableCell>
                        <TableCell>
                          {/* Botones de editar y eliminar */}
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => editarCita(cita)} 
                            sx={{ marginRight: 1 }}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={() => eliminarCita(cita._id)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </main>
        </div>
      </div>
    </MuiContainer>
  );
};

export default Citas;
