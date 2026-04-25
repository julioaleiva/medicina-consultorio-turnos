"""
Tests para el Sistema de Gestión - Consultorio Médico
"""

import json
import os
import sys
import tempfile
import unittest

# Patch data directory to a temp location for tests
_TEMP_DIR = tempfile.mkdtemp()

import paciente as paciente_mod
import turno as turno_mod
import historia_medica as historia_mod

paciente_mod.ARCHIVO = os.path.join(_TEMP_DIR, "pacientes.json")
turno_mod.ARCHIVO = os.path.join(_TEMP_DIR, "turnos.json")
turno_mod._contador_archivo = os.path.join(_TEMP_DIR, "turno_contador.json")
historia_mod.ARCHIVO = os.path.join(_TEMP_DIR, "historias_medicas.json")
historia_mod._contador_archivo = os.path.join(_TEMP_DIR, "historia_contador.json")


# ────────────────────────────── Paciente ──────────────────────────────


class TestPacienteModelo(unittest.TestCase):
    def test_to_dict_and_from_dict(self):
        p = paciente_mod.Paciente("12345678", "Juan", "Pérez", "01/01/1990", "1122334455", "Av. Siempreviva 123", "j@mail.com")
        d = p.to_dict()
        self.assertEqual(d["dni"], "12345678")
        p2 = paciente_mod.Paciente.from_dict(d)
        self.assertEqual(p2.nombre, "Juan")
        self.assertEqual(p2.apellido, "Pérez")

    def test_str_contains_dni(self):
        p = paciente_mod.Paciente("99999999", "Ana", "García", "15/06/1985", "1100000000", "Calle Falsa 456")
        self.assertIn("99999999", str(p))


class TestPacienteCRUD(unittest.TestCase):
    def setUp(self):
        # Start with a clean slate
        for f in [paciente_mod.ARCHIVO]:
            if os.path.exists(f):
                os.remove(f)

    def test_alta_y_carga(self):
        p = paciente_mod.Paciente("11111111", "Carlos", "López", "20/03/1970", "1155555555", "Mitre 100")
        pacientes = [p]
        paciente_mod._guardar_pacientes(pacientes)
        cargados = paciente_mod._cargar_pacientes()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].dni, "11111111")

    def test_baja(self):
        p1 = paciente_mod.Paciente("22222222", "Luis", "Martínez", "10/10/1980", "1166666666", "Belgrano 200")
        p2 = paciente_mod.Paciente("33333333", "María", "Rodríguez", "05/05/1975", "1177777777", "San Martín 300")
        paciente_mod._guardar_pacientes([p1, p2])
        pacientes = paciente_mod._cargar_pacientes()
        pacientes = [p for p in pacientes if p.dni != "22222222"]
        paciente_mod._guardar_pacientes(pacientes)
        cargados = paciente_mod._cargar_pacientes()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].dni, "33333333")

    def test_modificacion(self):
        p = paciente_mod.Paciente("44444444", "Rosa", "Díaz", "22/11/1995", "1188888888", "Rivadavia 400")
        paciente_mod._guardar_pacientes([p])
        pacientes = paciente_mod._cargar_pacientes()
        pacientes[0].telefono = "1199999999"
        paciente_mod._guardar_pacientes(pacientes)
        cargados = paciente_mod._cargar_pacientes()
        self.assertEqual(cargados[0].telefono, "1199999999")


# ────────────────────────────── Turno ──────────────────────────────


class TestTurnoModelo(unittest.TestCase):
    def test_to_dict_and_from_dict(self):
        t = turno_mod.Turno(1, "12345678", "Dr. Pérez", "Clínica", "10/05/2026", "09:00")
        d = t.to_dict()
        self.assertEqual(d["id_turno"], 1)
        t2 = turno_mod.Turno.from_dict(d)
        self.assertEqual(t2.medico, "Dr. Pérez")
        self.assertEqual(t2.estado, "activo")

    def test_str_contains_id(self):
        t = turno_mod.Turno(42, "99999999", "Dr. García", "Pediatría", "01/06/2026", "14:30")
        self.assertIn("42", str(t))


class TestTurnoCRUD(unittest.TestCase):
    def setUp(self):
        for f in [turno_mod.ARCHIVO, turno_mod._contador_archivo]:
            if os.path.exists(f):
                os.remove(f)

    def test_alta_y_carga(self):
        t = turno_mod.Turno(1, "55555555", "Dr. Gómez", "Cardiología", "15/06/2026", "10:00")
        turno_mod._guardar_turnos([t])
        cargados = turno_mod._cargar_turnos()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].paciente_dni, "55555555")

    def test_baja(self):
        t1 = turno_mod.Turno(1, "66666666", "Dr. Ruiz", "Dermatología", "20/06/2026", "11:00")
        t2 = turno_mod.Turno(2, "77777777", "Dra. Torres", "Neurología", "21/06/2026", "12:00")
        turno_mod._guardar_turnos([t1, t2])
        turnos = turno_mod._cargar_turnos()
        turnos = [t for t in turnos if t.id_turno != 1]
        turno_mod._guardar_turnos(turnos)
        cargados = turno_mod._cargar_turnos()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].id_turno, 2)

    def test_modificacion_estado(self):
        t = turno_mod.Turno(3, "88888888", "Dr. Flores", "Traumatología", "25/06/2026", "15:00")
        turno_mod._guardar_turnos([t])
        turnos = turno_mod._cargar_turnos()
        turnos[0].estado = "cancelado"
        turno_mod._guardar_turnos(turnos)
        cargados = turno_mod._cargar_turnos()
        self.assertEqual(cargados[0].estado, "cancelado")

    def test_siguiente_id_incrementa(self):
        id1 = turno_mod._siguiente_id()
        id2 = turno_mod._siguiente_id()
        self.assertGreater(id2, id1)


# ────────────────────────────── Historia Médica ──────────────────────────────


class TestHistoriaModelo(unittest.TestCase):
    def test_to_dict_and_from_dict(self):
        h = historia_mod.HistoriaMedica(1, "12345678", "01/04/2026", "Dr. Sosa", "Gripe", "Reposo y paracetamol", "Sin alergias")
        d = h.to_dict()
        self.assertEqual(d["id_historia"], 1)
        h2 = historia_mod.HistoriaMedica.from_dict(d)
        self.assertEqual(h2.diagnostico, "Gripe")
        self.assertEqual(h2.observaciones, "Sin alergias")

    def test_str_contains_diagnostico(self):
        h = historia_mod.HistoriaMedica(5, "99999999", "02/04/2026", "Dra. Lima", "Hipertensión", "Losartán 50 mg")
        self.assertIn("Hipertensión", str(h))


class TestHistoriaCRUD(unittest.TestCase):
    def setUp(self):
        for f in [historia_mod.ARCHIVO, historia_mod._contador_archivo]:
            if os.path.exists(f):
                os.remove(f)

    def test_alta_y_carga(self):
        h = historia_mod.HistoriaMedica(1, "11111111", "10/04/2026", "Dr. Vera", "Diabetes tipo 2", "Metformina 850 mg")
        historia_mod._guardar_historias([h])
        cargados = historia_mod._cargar_historias()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].paciente_dni, "11111111")

    def test_baja(self):
        h1 = historia_mod.HistoriaMedica(1, "22222222", "11/04/2026", "Dr. Paz", "Asma", "Salbutamol")
        h2 = historia_mod.HistoriaMedica(2, "33333333", "12/04/2026", "Dra. Rey", "Anemia", "Hierro oral")
        historia_mod._guardar_historias([h1, h2])
        historias = historia_mod._cargar_historias()
        historias = [h for h in historias if h.id_historia != 1]
        historia_mod._guardar_historias(historias)
        cargados = historia_mod._cargar_historias()
        self.assertEqual(len(cargados), 1)
        self.assertEqual(cargados[0].id_historia, 2)

    def test_modificacion_diagnostico(self):
        h = historia_mod.HistoriaMedica(3, "44444444", "13/04/2026", "Dr. Cruz", "Resfrio", "Reposo")
        historia_mod._guardar_historias([h])
        historias = historia_mod._cargar_historias()
        historias[0].diagnostico = "Rinitis alérgica"
        historia_mod._guardar_historias(historias)
        cargados = historia_mod._cargar_historias()
        self.assertEqual(cargados[0].diagnostico, "Rinitis alérgica")

    def test_siguiente_id_incrementa(self):
        id1 = historia_mod._siguiente_id()
        id2 = historia_mod._siguiente_id()
        self.assertGreater(id2, id1)


if __name__ == "__main__":
    unittest.main()
