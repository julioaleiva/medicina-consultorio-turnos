const { all, get, run } = require('../db/connection');

function hydrateAppointmentBaseQuery() {
  return `
    SELECT
      a.*,
      p.first_name,
      p.last_name,
      p.dni,
      p.phone,
      p.email,
      p.insurance
    FROM appointments a
    INNER JOIN patients p ON p.id = a.patient_id
  `;
}

async function listAppointments({ date, search } = {}) {
  const conditions = [];
  const params = [];

  if (date) {
    conditions.push('a.appointment_date = ?');
    params.push(date);
  }

  if (search) {
    conditions.push('(p.first_name LIKE ? OR p.last_name LIKE ? OR a.professional LIKE ? OR a.reason LIKE ?)');
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return all(
    `${hydrateAppointmentBaseQuery()}
     ${whereClause}
     ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
    params
  );
}

function getAppointmentById(id) {
  return get(
    `${hydrateAppointmentBaseQuery()}
     WHERE a.id = ?`,
    [id]
  );
}

async function createAppointment(appointment) {
  const result = await run(
    `INSERT INTO appointments (patient_id, appointment_date, appointment_time, professional, reason, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      appointment.patientId,
      appointment.date,
      appointment.time,
      appointment.professional.trim(),
      appointment.reason.trim(),
      appointment.status
    ]
  );

  return getAppointmentById(result.id);
}

async function updateAppointment(id, appointment) {
  await run(
    `UPDATE appointments
     SET patient_id = ?,
         appointment_date = ?,
         appointment_time = ?,
         professional = ?,
         reason = ?,
         status = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      appointment.patientId,
      appointment.date,
      appointment.time,
      appointment.professional.trim(),
      appointment.reason.trim(),
      appointment.status,
      id
    ]
  );

  return getAppointmentById(id);
}

module.exports = {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment
};
