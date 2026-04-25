import json
import os

ARCHIVO = os.path.join(os.path.dirname(__file__), "data", "turnos.json")
_contador_archivo = os.path.join(os.path.dirname(__file__), "data", "turno_contador.json")


class Turno:
    def __init__(self, id_turno, paciente_dni, medico, especialidad, fecha, hora, estado="activo"):
        self.id_turno = id_turno
        self.paciente_dni = paciente_dni
        self.medico = medico
        self.especialidad = especialidad
        self.fecha = fecha
        self.hora = hora
        self.estado = estado

    def to_dict(self):
        return {
            "id_turno": self.id_turno,
            "paciente_dni": self.paciente_dni,
            "medico": self.medico,
            "especialidad": self.especialidad,
            "fecha": self.fecha,
            "hora": self.hora,
            "estado": self.estado,
        }

    @staticmethod
    def from_dict(data):
        return Turno(
            data["id_turno"],
            data["paciente_dni"],
            data["medico"],
            data["especialidad"],
            data["fecha"],
            data["hora"],
            data.get("estado", "activo"),
        )

    def __str__(self):
        return (
            f"ID: {self.id_turno} | Paciente DNI: {self.paciente_dni} | "
            f"Médico: {self.medico} | Especialidad: {self.especialidad} | "
            f"Fecha: {self.fecha} | Hora: {self.hora} | Estado: {self.estado}"
        )


def _siguiente_id():
    os.makedirs(os.path.dirname(_contador_archivo), exist_ok=True)
    if not os.path.exists(_contador_archivo):
        contador = 1
    else:
        with open(_contador_archivo, "r", encoding="utf-8") as f:
            contador = json.load(f).get("ultimo_id", 0) + 1
    with open(_contador_archivo, "w", encoding="utf-8") as f:
        json.dump({"ultimo_id": contador}, f)
    return contador


def _cargar_turnos():
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r", encoding="utf-8") as f:
        return [Turno.from_dict(d) for d in json.load(f)]


def _guardar_turnos(turnos):
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    with open(ARCHIVO, "w", encoding="utf-8") as f:
        json.dump([t.to_dict() for t in turnos], f, ensure_ascii=False, indent=2)


def alta_turno():
    turnos = _cargar_turnos()
    print("\n--- Alta de Turno ---")
    paciente_dni = input("DNI del Paciente: ").strip()
    if not paciente_dni:
        print("El DNI del paciente no puede estar vacío.")
        return
    medico = input("Médico: ").strip()
    especialidad = input("Especialidad: ").strip()
    fecha = input("Fecha del Turno (dd/mm/aaaa): ").strip()
    hora = input("Hora del Turno (hh:mm): ").strip()
    id_turno = _siguiente_id()
    turno = Turno(id_turno, paciente_dni, medico, especialidad, fecha, hora)
    turnos.append(turno)
    _guardar_turnos(turnos)
    print(f"Turno #{id_turno} dado de alta correctamente.")


def baja_turno():
    turnos = _cargar_turnos()
    print("\n--- Baja de Turno ---")
    try:
        id_turno = int(input("Ingrese el ID del turno a dar de baja: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for t in turnos:
        if t.id_turno == id_turno:
            confirmacion = input(
                f"¿Confirma dar de baja el turno #{id_turno} "
                f"({t.fecha} {t.hora} - Dr/a. {t.medico})? (s/n): "
            ).strip().lower()
            if confirmacion == "s":
                turnos.remove(t)
                _guardar_turnos(turnos)
                print("Turno dado de baja correctamente.")
            else:
                print("Operación cancelada.")
            return
    print(f"No se encontró ningún turno con ID {id_turno}.")


def modificar_turno():
    turnos = _cargar_turnos()
    print("\n--- Modificación de Turno ---")
    try:
        id_turno = int(input("Ingrese el ID del turno a modificar: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for t in turnos:
        if t.id_turno == id_turno:
            print(f"Datos actuales: {t}")
            print("(Deje en blanco para mantener el valor actual)")
            paciente_dni = (
                input(f"DNI del Paciente [{t.paciente_dni}]: ").strip() or t.paciente_dni
            )
            medico = input(f"Médico [{t.medico}]: ").strip() or t.medico
            especialidad = input(f"Especialidad [{t.especialidad}]: ").strip() or t.especialidad
            fecha = input(f"Fecha [{t.fecha}]: ").strip() or t.fecha
            hora = input(f"Hora [{t.hora}]: ").strip() or t.hora
            estado = input(f"Estado [{t.estado}] (activo/cancelado): ").strip() or t.estado
            t.paciente_dni = paciente_dni
            t.medico = medico
            t.especialidad = especialidad
            t.fecha = fecha
            t.hora = hora
            t.estado = estado
            _guardar_turnos(turnos)
            print("Turno modificado correctamente.")
            return
    print(f"No se encontró ningún turno con ID {id_turno}.")


def consultar_turno():
    turnos = _cargar_turnos()
    print("\n--- Consulta de Turno ---")
    try:
        id_turno = int(input("Ingrese el ID del turno a consultar: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for t in turnos:
        if t.id_turno == id_turno:
            print(t)
            return
    print(f"No se encontró ningún turno con ID {id_turno}.")


def listar_turnos():
    turnos = _cargar_turnos()
    print("\n--- Listado de Turnos ---")
    if not turnos:
        print("No hay turnos registrados.")
        return
    for t in turnos:
        print(t)
    print(f"\nTotal: {len(turnos)} turno(s).")


def listar_turnos_por_paciente():
    turnos = _cargar_turnos()
    print("\n--- Turnos por Paciente ---")
    dni = input("Ingrese el DNI del paciente: ").strip()
    resultado = [t for t in turnos if t.paciente_dni == dni]
    if not resultado:
        print(f"No se encontraron turnos para el paciente con DNI {dni}.")
        return
    for t in resultado:
        print(t)
    print(f"\nTotal: {len(resultado)} turno(s).")
