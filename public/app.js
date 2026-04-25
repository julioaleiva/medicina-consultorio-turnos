const state = {
  patients: [],
  appointments: [],
  records: []
};

const elements = {
  flash: document.querySelector('#flash'),
  menuToggle: document.querySelector('#menu-toggle'),
  sidebar: document.querySelector('.sidebar'),
  navCards: [...document.querySelectorAll('.nav-card')],
  sections: [...document.querySelectorAll('.section')],
  dashboardStats: document.querySelector('#dashboard-stats'),
  dashboardUpcoming: document.querySelector('#dashboard-upcoming'),
  patientSearch: document.querySelector('#patient-search'),
  patientsTable: document.querySelector('#patients-table'),
  patientForm: document.querySelector('#patient-form'),
  patientReset: document.querySelector('#patient-reset'),
  appointmentForm: document.querySelector('#appointment-form'),
  appointmentReset: document.querySelector('#appointment-reset'),
  appointmentDateFilter: document.querySelector('#appointment-date-filter'),
  appointmentSearch: document.querySelector('#appointment-search'),
  appointmentsList: document.querySelector('#appointments-list'),
  recordForm: document.querySelector('#record-form'),
  recordReset: document.querySelector('#record-reset'),
  recordPatientFilter: document.querySelector('#record-patient-filter'),
  recordsList: document.querySelector('#records-list')
};

const patientFields = {
  id: document.querySelector('#patient-id'),
  firstName: document.querySelector('#patient-first-name'),
  lastName: document.querySelector('#patient-last-name'),
  dni: document.querySelector('#patient-dni'),
  birthDate: document.querySelector('#patient-birth-date'),
  phone: document.querySelector('#patient-phone'),
  email: document.querySelector('#patient-email'),
  insurance: document.querySelector('#patient-insurance'),
  notes: document.querySelector('#patient-notes')
};

const appointmentFields = {
  id: document.querySelector('#appointment-id'),
  patientId: document.querySelector('#appointment-patient'),
  date: document.querySelector('#appointment-date'),
  time: document.querySelector('#appointment-time'),
  professional: document.querySelector('#appointment-professional'),
  reason: document.querySelector('#appointment-reason'),
  status: document.querySelector('#appointment-status')
};

const recordFields = {
  patientId: document.querySelector('#record-patient'),
  recordDate: document.querySelector('#record-date'),
  consultationReason: document.querySelector('#record-consultation-reason'),
  diagnosis: document.querySelector('#record-diagnosis'),
  treatment: document.querySelector('#record-treatment'),
  indications: document.querySelector('#record-indications'),
  notes: document.querySelector('#record-notes')
};

function showMessage(message, type = 'success') {
  elements.flash.textContent = message;
  elements.flash.className = `flash ${type}`;

  window.clearTimeout(showMessage.timeoutId);
  showMessage.timeoutId = window.setTimeout(() => {
    elements.flash.className = 'flash hidden';
    elements.flash.textContent = '';
  }, 3600);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrio un error inesperado.');
  }

  return data;
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}

function getLocalDateInputValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function formatPatientName(patient) {
  return `${patient.last_name || patient.lastName}, ${patient.first_name || patient.firstName}`;
}

function switchSection(sectionId) {
  elements.sections.forEach((section) => {
    section.classList.toggle('is-visible', section.id === `section-${sectionId}`);
  });

  elements.navCards.forEach((card) => {
    card.classList.toggle('is-active', card.dataset.section === sectionId);
  });

  elements.sidebar.classList.remove('is-open');
}

function populatePatientSelects() {
  const options = state.patients
    .map((patient) => `<option value="${patient.id}">${formatPatientName(patient)} · DNI ${patient.dni}</option>`)
    .join('');

  appointmentFields.patientId.innerHTML = '<option value="">Seleccionar paciente</option>' + options;
  recordFields.patientId.innerHTML = '<option value="">Seleccionar paciente</option>' + options;
  elements.recordPatientFilter.innerHTML = '<option value="">Todos los pacientes</option>' + options;
}

function renderDashboard(data) {
  elements.dashboardStats.innerHTML = `
    <article class="stat-card">
      <span class="eyebrow">Pacientes</span>
      <strong>${data.totalPatients}</strong>
      <span class="muted">Base disponible para la demo</span>
    </article>
    <article class="stat-card">
      <span class="eyebrow">Turnos de hoy</span>
      <strong>${data.todayAppointments}</strong>
      <span class="muted">Agenda del dia en tiempo real</span>
    </article>
    <article class="stat-card">
      <span class="eyebrow">Proximos turnos</span>
      <strong>${data.upcomingAppointments.length}</strong>
      <span class="muted">Siguientes citas programadas</span>
    </article>
  `;

  if (!data.upcomingAppointments.length) {
    elements.dashboardUpcoming.innerHTML = '<div class="empty-state">No hay turnos proximos cargados.</div>';
    return;
  }

  elements.dashboardUpcoming.innerHTML = data.upcomingAppointments
    .map(
      (appointment) => `
        <article class="stack-item">
          <header>
            <strong>${appointment.last_name}, ${appointment.first_name}</strong>
            <span class="pill ${appointment.status}">${appointment.status}</span>
          </header>
          <div class="meta">${formatDate(appointment.appointment_date)} · ${appointment.appointment_time} · ${appointment.professional}</div>
          <p>${appointment.reason}</p>
        </article>
      `
    )
    .join('');
}

function renderPatients() {
  if (!state.patients.length) {
    elements.patientsTable.innerHTML = '<tr><td colspan="5"><div class="empty-state">No se encontraron pacientes.</div></td></tr>';
    return;
  }

  elements.patientsTable.innerHTML = state.patients
    .map(
      (patient) => `
        <tr>
          <td>${formatPatientName(patient)}</td>
          <td>${patient.dni}</td>
          <td>${patient.phone}<br /><span class="muted">${patient.email || 'Sin email'}</span></td>
          <td>${patient.insurance || 'Sin obra social'}</td>
          <td><button class="table-action" type="button" data-edit-patient="${patient.id}">Editar</button></td>
        </tr>
      `
    )
    .join('');
}

function renderAppointments() {
  if (!state.appointments.length) {
    elements.appointmentsList.innerHTML = '<div class="empty-state">No hay turnos para los filtros aplicados.</div>';
    return;
  }

  elements.appointmentsList.innerHTML = state.appointments
    .map(
      (appointment) => `
        <article class="stack-item">
          <header>
            <strong>${appointment.last_name}, ${appointment.first_name}</strong>
            <span class="pill ${appointment.status}">${appointment.status}</span>
          </header>
          <div class="meta">${formatDate(appointment.appointment_date)} · ${appointment.appointment_time}</div>
          <p><strong>${appointment.professional}</strong> · ${appointment.reason}</p>
          <div class="inline-actions">
            <button class="table-action" type="button" data-edit-appointment="${appointment.id}">Editar</button>
            ${appointment.status !== 'cancelado'
              ? `<button class="table-action table-action--danger" type="button" data-cancel-appointment="${appointment.id}">Cancelar turno</button>`
              : ''}
          </div>
        </article>
      `
    )
    .join('');
}

function renderRecords() {
  if (!state.records.length) {
    elements.recordsList.innerHTML = '<div class="empty-state">No hay historias clinicas para mostrar.</div>';
    return;
  }

  elements.recordsList.innerHTML = state.records
    .map(
      (record) => `
        <article class="timeline-item">
          <header>
            <strong>${record.last_name}, ${record.first_name}</strong>
            <span>${formatDate(record.record_date)}</span>
          </header>
          <p><strong>Motivo:</strong> ${record.consultation_reason}</p>
          <p><strong>Diagnostico:</strong> ${record.diagnosis}</p>
          <p><strong>Tratamiento:</strong> ${record.treatment}</p>
          <p><strong>Indicaciones:</strong> ${record.indications || 'Sin indicaciones cargadas.'}</p>
          <p><strong>Observaciones:</strong> ${record.notes || 'Sin observaciones.'}</p>
        </article>
      `
    )
    .join('');
}

async function loadDashboard() {
  const data = await api('/api/dashboard');
  renderDashboard(data);
}

async function loadPatients(search = '') {
  state.patients = await api(`/api/patients?search=${encodeURIComponent(search)}`);
  populatePatientSelects();
  renderPatients();
}

async function loadAppointments() {
  const params = new URLSearchParams();

  if (elements.appointmentDateFilter.value) {
    params.set('date', elements.appointmentDateFilter.value);
  }

  if (elements.appointmentSearch.value.trim()) {
    params.set('search', elements.appointmentSearch.value.trim());
  }

  state.appointments = await api(`/api/appointments?${params.toString()}`);
  renderAppointments();
}

async function loadRecords() {
  const patientId = elements.recordPatientFilter.value;
  const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';

  state.records = await api(`/api/clinical-records${query}`);
  renderRecords();
}

function resetPatientForm() {
  elements.patientForm.reset();
  patientFields.id.value = '';
}

function resetAppointmentForm() {
  elements.appointmentForm.reset();
  appointmentFields.id.value = '';
}

function resetRecordForm() {
  elements.recordForm.reset();
}

async function refreshAll() {
  await Promise.all([loadDashboard(), loadPatients(), loadAppointments(), loadRecords()]);
}

function setTodayDefaults() {
  const today = getLocalDateInputValue();
  elements.appointmentDateFilter.value = today;
  appointmentFields.date.value = today;
  recordFields.recordDate.value = today;
}

async function cancelAppointment(appointmentId) {
  const appointment = state.appointments.find((entry) => entry.id === appointmentId);

  if (!appointment) {
    showMessage('No se encontro el turno seleccionado.', 'error');
    return;
  }

  const shouldCancel = window.confirm(`Se cancelara el turno de ${appointment.last_name}, ${appointment.first_name}.`);

  if (!shouldCancel) {
    return;
  }

  const payload = {
    patientId: appointment.patient_id,
    date: appointment.appointment_date,
    time: appointment.appointment_time,
    professional: appointment.professional,
    reason: appointment.reason,
    status: 'cancelado'
  };

  const result = await api(`/api/appointments/${appointment.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  if (appointmentFields.id.value === String(appointment.id)) {
    appointmentFields.status.value = 'cancelado';
  }

  showMessage(result.message || 'Turno cancelado correctamente.');
  await Promise.all([loadDashboard(), loadAppointments()]);
}

function bindEvents() {
  elements.menuToggle.addEventListener('click', () => {
    elements.sidebar.classList.toggle('is-open');
  });

  elements.navCards.forEach((card) => {
    card.addEventListener('click', () => switchSection(card.dataset.section));
  });

  document.querySelectorAll('[data-section-target]').forEach((button) => {
    button.addEventListener('click', () => switchSection(button.dataset.sectionTarget));
  });

  elements.patientSearch.addEventListener('input', async (event) => {
    try {
      await loadPatients(event.target.value);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.appointmentDateFilter.addEventListener('change', async () => {
    try {
      await loadAppointments();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.appointmentSearch.addEventListener('input', async () => {
    try {
      await loadAppointments();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.recordPatientFilter.addEventListener('change', async () => {
    try {
      await loadRecords();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.patientReset.addEventListener('click', resetPatientForm);
  elements.appointmentReset.addEventListener('click', resetAppointmentForm);
  elements.recordReset.addEventListener('click', resetRecordForm);

  elements.patientForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      firstName: patientFields.firstName.value.trim(),
      lastName: patientFields.lastName.value.trim(),
      dni: patientFields.dni.value.trim(),
      birthDate: patientFields.birthDate.value,
      phone: patientFields.phone.value.trim(),
      email: patientFields.email.value.trim(),
      insurance: patientFields.insurance.value.trim(),
      notes: patientFields.notes.value.trim()
    };

    try {
      const method = patientFields.id.value ? 'PUT' : 'POST';
      const path = patientFields.id.value ? `/api/patients/${patientFields.id.value}` : '/api/patients';
      const result = await api(path, { method, body: JSON.stringify(payload) });
      showMessage(result.message);
      resetPatientForm();
      await refreshAll();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.patientsTable.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-edit-patient]');

    if (!button) {
      return;
    }

    const patient = state.patients.find((entry) => entry.id === Number(button.dataset.editPatient));

    if (!patient) {
      return;
    }

    patientFields.id.value = patient.id;
    patientFields.firstName.value = patient.first_name;
    patientFields.lastName.value = patient.last_name;
    patientFields.dni.value = patient.dni;
    patientFields.birthDate.value = patient.birth_date;
    patientFields.phone.value = patient.phone;
    patientFields.email.value = patient.email || '';
    patientFields.insurance.value = patient.insurance || '';
    patientFields.notes.value = patient.notes || '';
    switchSection('patients');
  });

  elements.appointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      patientId: Number(appointmentFields.patientId.value),
      date: appointmentFields.date.value,
      time: appointmentFields.time.value,
      professional: appointmentFields.professional.value.trim(),
      reason: appointmentFields.reason.value.trim(),
      status: appointmentFields.status.value
    };

    try {
      const method = appointmentFields.id.value ? 'PUT' : 'POST';
      const path = appointmentFields.id.value ? `/api/appointments/${appointmentFields.id.value}` : '/api/appointments';
      const result = await api(path, { method, body: JSON.stringify(payload) });
      showMessage(result.message);
      resetAppointmentForm();
      setTodayDefaults();
      await Promise.all([loadDashboard(), loadAppointments()]);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  elements.appointmentsList.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-appointment]');
    const cancelButton = event.target.closest('[data-cancel-appointment]');

    if (cancelButton) {
      cancelAppointment(Number(cancelButton.dataset.cancelAppointment)).catch((error) => {
        showMessage(error.message, 'error');
      });
      return;
    }

    if (!editButton) {
      return;
    }

    const appointment = state.appointments.find((entry) => entry.id === Number(editButton.dataset.editAppointment));

    if (!appointment) {
      return;
    }

    appointmentFields.id.value = appointment.id;
    appointmentFields.patientId.value = appointment.patient_id;
    appointmentFields.date.value = appointment.appointment_date;
    appointmentFields.time.value = appointment.appointment_time;
    appointmentFields.professional.value = appointment.professional;
    appointmentFields.reason.value = appointment.reason;
    appointmentFields.status.value = appointment.status;
    switchSection('appointments');
  });

  elements.recordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      patientId: Number(recordFields.patientId.value),
      recordDate: recordFields.recordDate.value,
      consultationReason: recordFields.consultationReason.value.trim(),
      diagnosis: recordFields.diagnosis.value.trim(),
      treatment: recordFields.treatment.value.trim(),
      indications: recordFields.indications.value.trim(),
      notes: recordFields.notes.value.trim()
    };

    try {
      const result = await api('/api/clinical-records', { method: 'POST', body: JSON.stringify(payload) });
      showMessage(result.message);
      resetRecordForm();
      recordFields.recordDate.value = getLocalDateInputValue();
      await loadRecords();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });
}

async function init() {
  setTodayDefaults();
  bindEvents();
  switchSection('dashboard');

  try {
    await refreshAll();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

init();
