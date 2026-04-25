const express = require('express');
const { createAppointment, getAppointmentById, listAppointments, updateAppointment } = require('../repositories/appointmentRepository');
const { getPatientById } = require('../repositories/patientRepository');
const { validateAppointment } = require('../utils/validation');

const router = express.Router();

router.get('/', async (request, response, next) => {
  try {
    const appointments = await listAppointments({
      date: request.query.date,
      search: request.query.search
    });

    response.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const errors = validateAppointment(request.body);

    if (errors.length) {
      response.status(400).json({ message: errors.join(' ') });
      return;
    }

    const patient = await getPatientById(Number(request.body.patientId));

    if (!patient) {
      response.status(404).json({ message: 'El paciente seleccionado no existe.' });
      return;
    }

    const appointment = await createAppointment(request.body);
    response.status(201).json({ message: 'Turno creado correctamente.', appointment });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    const appointmentId = Number(request.params.id);
    const existingAppointment = await getAppointmentById(appointmentId);

    if (!existingAppointment) {
      response.status(404).json({ message: 'Turno no encontrado.' });
      return;
    }

    const errors = validateAppointment(request.body);

    if (errors.length) {
      response.status(400).json({ message: errors.join(' ') });
      return;
    }

    const patient = await getPatientById(Number(request.body.patientId));

    if (!patient) {
      response.status(404).json({ message: 'El paciente seleccionado no existe.' });
      return;
    }

    const appointment = await updateAppointment(appointmentId, request.body);
    response.json({ message: 'Turno actualizado correctamente.', appointment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
