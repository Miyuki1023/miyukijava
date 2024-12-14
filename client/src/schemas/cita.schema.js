export const citaSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
  }),
  celular: z
    .string({
      required_error: "El celular es obligatorio",
    })
    .regex(/^\d{9}$/, {
      message: "El celular debe contener 9 dígitos",
    }),
  diseño: z.string().nonempty("Selecciona un diseño válido"),
  
  tipo: z.string({
    required_error: "El tipo es obligatorio",
  }),
  categoria: z.string({
    required_error: "La categoría es obligatoria",
  }),
  fecha: z.date().refine(),
 // Valida el formato de fecha
  hora: z.enum(
    [
      "8:15 a 10:00",
      "10:15 a 12:00",
      "14:15 a 16:00",
      "16:15 a 18:00",
      "18:15 a 20:00",
      "20:15 a 22:00",
    ],
    {
      required_error: "La hora debe coincidir con un horario de trabajo",
    }
  ),
  username: z.string({
    required_error: "El usuario es obligatorio",
  }),
});
