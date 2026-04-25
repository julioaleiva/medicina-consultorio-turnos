const { all, get, run } = require('../db/connection');

async function listRecordsByPatient(patientId) {
  return all(
    `SELECT
      r.*,
      p.first_name,
      p.last_name,
      p.dni
     FROM clinical_records r
     INNER JOIN patients p ON p.id = r.patient_id
     WHERE r.patient_id = ?
     ORDER BY r.record_date DESC, r.id DESC`,
    [patientId]
  );
}

async function listRecentRecords() {
  return all(
    `SELECT
      r.*,
      p.first_name,
      p.last_name,
      p.dni
     FROM clinical_records r
     INNER JOIN patients p ON p.id = r.patient_id
     ORDER BY r.record_date DESC, r.id DESC
     LIMIT 8`
  );
}

function getRecordById(id) {
  return get('SELECT * FROM clinical_records WHERE id = ?', [id]);
}

async function createRecord(record) {
  const result = await run(
    `INSERT INTO clinical_records (
      patient_id,
      record_date,
      consultation_reason,
      diagnosis,
      treatment,
      indications,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      record.patientId,
      record.recordDate,
      record.consultationReason.trim(),
      record.diagnosis.trim(),
      record.treatment.trim(),
      record.indications ? record.indications.trim() : '',
      record.notes ? record.notes.trim() : ''
    ]
  );

  return getRecordById(result.id);
}

module.exports = {
  listRecordsByPatient,
  listRecentRecords,
  createRecord
};
