const express = require('express');
const path = require('path');
const { initializeDatabase } = require('./db/init');
const { host, port } = require('./config');
const dashboardRoutes = require('./routes/dashboard');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const clinicalRecordRoutes = require('./routes/clinicalRecords');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinical-records', clinicalRecordRoutes);

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: 'Ocurrio un error interno en el servidor.' });
});

async function start() {
  await initializeDatabase();

  app.listen(port, host, () => {
    console.log(`Consultorio demo disponible en http://${host}:${port}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar la aplicacion:', error);
  process.exit(1);
});
