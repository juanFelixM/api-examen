require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth.routes');
const clasesRoutes = require('./routes/clases.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/clases', clasesRoutes);
app.use('/inscripciones', inscripcionesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});