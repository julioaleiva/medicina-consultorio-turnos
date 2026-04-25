const { all, get, run } = require('../db/connection');

async function listPatients(search = '') {
  const term = `%${search.trim()}%`;

  return all(
    `SELECT *
     FROM patients
     WHERE ? = '%%'
        OR first_name LIKE ?
        OR last_name LIKE ?
        OR dni LIKE ?
        OR phone LIKE ?
     ORDER BY last_name ASC, first_name ASC`,
    [term, term, term, term, term]
  );
}

function getPatientById(id) {
  return get('SELECT * FROM patients WHERE id = ?', [id]);
}

async function createPatient(patient) {
  const result = await run(
    `INSERT INTO patients (first_name, last_name, dni, birth_date, phone, email, insurance, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      patient.firstName.trim(),
      patient.lastName.trim(),
      String(patient.dni).trim(),
      patient.birthDate,
      patient.phone.trim(),
      patient.email ? patient.email.trim() : '',
      patient.insurance ? patient.insurance.trim() : '',
      patient.notes ? patient.notes.trim() : ''
    ]
  );

  return getPatientById(result.id);
}

async function updatePatient(id, patient) {
  await run(
    `UPDATE patients
     SET first_name = ?,
         last_name = ?,
         dni = ?,
         birth_date = ?,
         phone = ?,
         email = ?,
         insurance = ?,
         notes = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      patient.firstName.trim(),
      patient.lastName.trim(),
      String(patient.dni).trim(),
      patient.birthDate,
      patient.phone.trim(),
      patient.email ? patient.email.trim() : '',
      patient.insurance ? patient.insurance.trim() : '',
      patient.notes ? patient.notes.trim() : '',
      id
    ]
  );

  return getPatientById(id);
}

module.exports = {
  listPatients,
  getPatientById,
  createPatient,
  updatePatient
};
