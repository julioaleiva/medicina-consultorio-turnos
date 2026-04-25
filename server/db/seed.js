const { run } = require('./connection');

async function seedDatabase() {
  const patients = [
    {
      firstName: 'Lucia',
      lastName: 'Martinez',
      dni: '28123456',
      birthDate: '1988-04-12',
      phone: '11 4523-7788',
      email: 'lucia.martinez@example.com',
      insurance: 'OSDE 210',
      notes: 'Control anual de rutina.'
    },
    {
      firstName: 'Carlos',
      lastName: 'Ramirez',
      dni: '30999888',
      birthDate: '1979-09-03',
      phone: '11 5890-1122',
      email: 'carlos.ramirez@example.com',
      insurance: 'Swiss Medical',
      notes: 'Antecedente de hipertension controlada.'
    },
    {
      firstName: 'Valentina',
      lastName: 'Suarez',
      dni: '35666111',
      birthDate: '1994-01-24',
      phone: '11 3344-8899',
      email: 'valentina.suarez@example.com',
      insurance: 'Particular',
      notes: 'Seguimiento dermatologico.'
    },
    {
      firstName: 'Mateo',
      lastName: 'Fernandez',
      dni: '40222444',
      birthDate: '2001-11-15',
      phone: '11 7788-2233',
      email: 'mateo.fernandez@example.com',
      insurance: 'Galeno',
      notes: 'Alergia estacional.'
    }
  ];

  const createdPatients = [];

  for (const patient of patients) {
    const result = await run(
      `INSERT INTO patients (first_name, last_name, dni, birth_date, phone, email, insurance, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient.firstName,
        patient.lastName,
        patient.dni,
        patient.birthDate,
        patient.phone,
        patient.email,
        patient.insurance,
        patient.notes
      ]
    );

    createdPatients.push({ id: result.id, ...patient });
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);
  const tomorrow = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;
  const currentDate = `${yyyy}-${mm}-${dd}`;

  const appointments = [
    {
      patientId: createdPatients[0].id,
      date: currentDate,
      time: '09:00',
      professional: 'Dra. Paula Benitez',
      reason: 'Chequeo clinico general',
      status: 'confirmado'
    },
    {
      patientId: createdPatients[1].id,
      date: currentDate,
      time: '11:30',
      professional: 'Dr. Marcos Luna',
      reason: 'Control de presion arterial',
      status: 'pendiente'
    },
    {
      patientId: createdPatients[2].id,
      date: tomorrow,
      time: '15:00',
      professional: 'Dra. Paula Benitez',
      reason: 'Consulta dermatologica',
      status: 'confirmado'
    },
    {
      patientId: createdPatients[3].id,
      date: tomorrow,
      time: '17:15',
      professional: 'Dr. Marcos Luna',
      reason: 'Certificado aptitud fisica',
      status: 'pendiente'
    }
  ];

  for (const appointment of appointments) {
    await run(
      `INSERT INTO appointments (patient_id, appointment_date, appointment_time, professional, reason, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        appointment.patientId,
        appointment.date,
        appointment.time,
        appointment.professional,
        appointment.reason,
        appointment.status
      ]
    );
  }

  const records = [
    {
      patientId: createdPatients[0].id,
      recordDate: currentDate,
      consultationReason: 'Control anual',
      diagnosis: 'Buen estado general.',
      treatment: 'Sin medicacion.',
      indications: 'Mantener actividad fisica y controles anuales.',
      notes: 'Paciente sin sintomas.'
    },
    {
      patientId: createdPatients[1].id,
      recordDate: currentDate,
      consultationReason: 'Seguimiento hipertension',
      diagnosis: 'Tension arterial dentro de parametros esperados.',
      treatment: 'Continuar tratamiento habitual.',
      indications: 'Reducir sodio y controlar en 60 dias.',
      notes: 'Trajo estudios recientes.'
    },
    {
      patientId: createdPatients[2].id,
      recordDate: tomorrow,
      consultationReason: 'Lesion cutanea',
      diagnosis: 'Dermatitis leve.',
      treatment: 'Crema topica por 7 dias.',
      indications: 'Evitar exposicion solar intensa.',
      notes: 'Control si persiste la irritacion.'
    }
  ];

  for (const record of records) {
    await run(
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
        record.consultationReason,
        record.diagnosis,
        record.treatment,
        record.indications,
        record.notes
      ]
    );
  }
}

module.exports = {
  seedDatabase
};
