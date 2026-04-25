const express = require('express');
const { createRecord, listRecentRecords, listRecordsByPatient } = require('../repositories/clinicalRecordRepository');
const { getPatientById } = require('../repositories/patientRepository');
const { validateClinicalRecord } = require('../utils/validation');

const router = express.Router();

router.get('/', async (request, response, next) => {
  try {
    const { patientId } = request.query;

    if (patientId) {
      const patient = await getPatientById(Number(patientId));

      if (!patient) {
        response.status(404).json({ message: 'Paciente no encontrado.' });
        return;
      }

      const records = await listRecordsByPatient(Number(patientId));
      response.json(records);
      return;
    }

    const records = await listRecentRecords();
    response.json(records);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const errors = validateClinicalRecord(request.body);

    if (errors.length) {
      response.status(400).json({ message: errors.join(' ') });
      return;
    }

    const patient = await getPatientById(Number(request.body.patientId));

    if (!patient) {
      response.status(404).json({ message: 'El paciente seleccionado no existe.' });
      return;
    }

    const record = await createRecord(request.body);
    response.status(201).json({ message: 'Historia clinica registrada correctamente.', record });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
