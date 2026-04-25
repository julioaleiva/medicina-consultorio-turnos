const express = require('express');
const { all, get } = require('../db/connection');

const router = express.Router();

router.get('/', async (request, response, next) => {
  try {
    const todayRow = await get("SELECT date('now', 'localtime') AS today");
    const totalPatients = await get('SELECT COUNT(*) AS total FROM patients');
    const todayAppointments = await get(
      'SELECT COUNT(*) AS total FROM appointments WHERE appointment_date = ?',
      [todayRow.today]
    );
    const upcomingAppointments = await all(
      `SELECT
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.professional,
        a.reason,
        a.status,
        p.first_name,
        p.last_name
       FROM appointments a
       INNER JOIN patients p ON p.id = a.patient_id
       WHERE a.appointment_date >= ?
       ORDER BY a.appointment_date ASC, a.appointment_time ASC
       LIMIT 6`,
      [todayRow.today]
    );

    response.json({
      totalPatients: totalPatients.total,
      todayAppointments: todayAppointments.total,
      upcomingAppointments
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
