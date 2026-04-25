function isValidEmail(email) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePatient(payload) {
  const errors = [];

  if (!payload.firstName || payload.firstName.trim().length < 2) {
    errors.push('El nombre es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!payload.lastName || payload.lastName.trim().length < 2) {
    errors.push('El apellido es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!payload.dni || !/^\d{7,10}$/.test(String(payload.dni).trim())) {
    errors.push('El DNI es obligatorio y debe contener entre 7 y 10 digitos.');
  }

  if (!payload.birthDate) {
    errors.push('La fecha de nacimiento es obligatoria.');
  }

  if (!payload.phone || String(payload.phone).trim().length < 6) {
    errors.push('El telefono es obligatorio.');
  }

  if (!isValidEmail(payload.email)) {
    errors.push('El email no tiene un formato valido.');
  }

  return errors;
}

function validateAppointment(payload) {
  const errors = [];
  const allowedStatuses = ['pendiente', 'confirmado', 'cancelado', 'atendido'];

  if (!payload.patientId) {
    errors.push('El paciente es obligatorio.');
  }

  if (!payload.date) {
    errors.push('La fecha es obligatoria.');
  }

  if (!payload.time) {
    errors.push('La hora es obligatoria.');
  }

  if (!payload.professional || payload.professional.trim().length < 3) {
    errors.push('El profesional es obligatorio.');
  }

  if (!payload.reason || payload.reason.trim().length < 3) {
    errors.push('El motivo es obligatorio.');
  }

  if (!allowedStatuses.includes(payload.status)) {
    errors.push('El estado del turno no es valido.');
  }

  return errors;
}

function validateClinicalRecord(payload) {
  const errors = [];

  if (!payload.patientId) {
    errors.push('El paciente es obligatorio.');
  }

  if (!payload.recordDate) {
    errors.push('La fecha del registro es obligatoria.');
  }

  if (!payload.consultationReason || payload.consultationReason.trim().length < 3) {
    errors.push('El motivo de consulta es obligatorio.');
  }

  if (!payload.diagnosis || payload.diagnosis.trim().length < 3) {
    errors.push('El diagnostico es obligatorio.');
  }

  if (!payload.treatment || payload.treatment.trim().length < 3) {
    errors.push('El tratamiento es obligatorio.');
  }

  return errors;
}

module.exports = {
  validatePatient,
  validateAppointment,
  validateClinicalRecord
};
