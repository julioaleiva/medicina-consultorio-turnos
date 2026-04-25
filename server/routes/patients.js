const express = require('express');
const { createPatient, getPatientById, listPatients, updatePatient } = require('../repositories/patientRepository');
const { validatePatient } = require('../utils/validation');

const router = express.Router();

router.get('/', async (request, response, next) => {
  try {
    const patients = await listPatients(request.query.search || '');
    response.json(patients);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    const patient = await getPatientById(Number(request.params.id));

    if (!patient) {
      response.status(404).json({ message: 'Paciente no encontrado.' });
      return;
    }

    response.json(patient);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const errors = validatePatient(request.body);

    if (errors.length) {
      response.status(400).json({ message: errors.join(' ') });
      return;
    }

    const patient = await createPatient(request.body);
    response.status(201).json({ message: 'Paciente creado correctamente.', patient });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      response.status(409).json({ message: 'Ya existe un paciente con ese DNI.' });
      return;
    }

    next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    const patientId = Number(request.params.id);
    const existingPatient = await getPatientById(patientId);

    if (!existingPatient) {
      response.status(404).json({ message: 'Paciente no encontrado.' });
      return;
    }

    const errors = validatePatient(request.body);

    if (errors.length) {
      response.status(400).json({ message: errors.join(' ') });
      return;
    }

    const patient = await updatePatient(patientId, request.body);
    response.json({ message: 'Paciente actualizado correctamente.', patient });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      response.status(409).json({ message: 'Ya existe otro paciente con ese DNI.' });
      return;
    }

    next(error);
  }
});

module.exports = router;
