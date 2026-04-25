import json
import os

ARCHIVO = os.path.join(os.path.dirname(__file__), "data", "historias_medicas.json")
_contador_archivo = os.path.join(os.path.dirname(__file__), "data", "historia_contador.json")


class HistoriaMedica:
    def __init__(self, id_historia, paciente_dni, fecha, medico, diagnostico, tratamiento, observaciones=""):
        self.id_historia = id_historia
        self.paciente_dni = paciente_dni
        self.fecha = fecha
        self.medico = medico
        self.diagnostico = diagnostico
        self.tratamiento = tratamiento
        self.observaciones = observaciones

    def to_dict(self):
        return {
            "id_historia": self.id_historia,
            "paciente_dni": self.paciente_dni,
            "fecha": self.fecha,
            "medico": self.medico,
            "diagnostico": self.diagnostico,
            "tratamiento": self.tratamiento,
            "observaciones": self.observaciones,
        }

    @staticmethod
    def from_dict(data):
        return HistoriaMedica(
            data["id_historia"],
            data["paciente_dni"],
            data["fecha"],
            data["medico"],
            data["diagnostico"],
            data["tratamiento"],
            data.get("observaciones", ""),
        )

    def __str__(self):
        lineas = [
            f"ID: {self.id_historia} | Paciente DNI: {self.paciente_dni} | "
            f"Fecha: {self.fecha} | Médico: {self.medico}",
            f"  Diagnóstico : {self.diagnostico}",
            f"  Tratamiento : {self.tratamiento}",
        ]
        if self.observaciones:
            lineas.append(f"  Observaciones: {self.observaciones}")
        return "\n".join(lineas)


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


def _cargar_historias():
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r", encoding="utf-8") as f:
        return [HistoriaMedica.from_dict(d) for d in json.load(f)]


def _guardar_historias(historias):
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    with open(ARCHIVO, "w", encoding="utf-8") as f:
        json.dump([h.to_dict() for h in historias], f, ensure_ascii=False, indent=2)


def alta_historia():
    historias = _cargar_historias()
    print("\n--- Alta de Historia Médica ---")
    paciente_dni = input("DNI del Paciente: ").strip()
    if not paciente_dni:
        print("El DNI del paciente no puede estar vacío.")
        return
    fecha = input("Fecha de la consulta (dd/mm/aaaa): ").strip()
    medico = input("Médico: ").strip()
    diagnostico = input("Diagnóstico: ").strip()
    tratamiento = input("Tratamiento: ").strip()
    observaciones = input("Observaciones (opcional): ").strip()
    id_historia = _siguiente_id()
    historia = HistoriaMedica(id_historia, paciente_dni, fecha, medico, diagnostico, tratamiento, observaciones)
    historias.append(historia)
    _guardar_historias(historias)
    print(f"Historia médica #{id_historia} dada de alta correctamente.")


def baja_historia():
    historias = _cargar_historias()
    print("\n--- Baja de Historia Médica ---")
    try:
        id_historia = int(input("Ingrese el ID de la historia médica a dar de baja: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for h in historias:
        if h.id_historia == id_historia:
            confirmacion = input(
                f"¿Confirma dar de baja la historia #{id_historia} "
                f"del paciente DNI {h.paciente_dni} ({h.fecha})? (s/n): "
            ).strip().lower()
            if confirmacion == "s":
                historias.remove(h)
                _guardar_historias(historias)
                print("Historia médica dada de baja correctamente.")
            else:
                print("Operación cancelada.")
            return
    print(f"No se encontró ninguna historia médica con ID {id_historia}.")


def modificar_historia():
    historias = _cargar_historias()
    print("\n--- Modificación de Historia Médica ---")
    try:
        id_historia = int(input("Ingrese el ID de la historia médica a modificar: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for h in historias:
        if h.id_historia == id_historia:
            print(f"Datos actuales:\n{h}")
            print("(Deje en blanco para mantener el valor actual)")
            paciente_dni = (
                input(f"DNI del Paciente [{h.paciente_dni}]: ").strip() or h.paciente_dni
            )
            fecha = input(f"Fecha [{h.fecha}]: ").strip() or h.fecha
            medico = input(f"Médico [{h.medico}]: ").strip() or h.medico
            diagnostico = input(f"Diagnóstico [{h.diagnostico}]: ").strip() or h.diagnostico
            tratamiento = input(f"Tratamiento [{h.tratamiento}]: ").strip() or h.tratamiento
            observaciones = input(f"Observaciones [{h.observaciones}]: ").strip() or h.observaciones
            h.paciente_dni = paciente_dni
            h.fecha = fecha
            h.medico = medico
            h.diagnostico = diagnostico
            h.tratamiento = tratamiento
            h.observaciones = observaciones
            _guardar_historias(historias)
            print("Historia médica modificada correctamente.")
            return
    print(f"No se encontró ninguna historia médica con ID {id_historia}.")


def consultar_historia():
    historias = _cargar_historias()
    print("\n--- Consulta de Historia Médica ---")
    try:
        id_historia = int(input("Ingrese el ID de la historia médica a consultar: ").strip())
    except ValueError:
        print("ID inválido.")
        return
    for h in historias:
        if h.id_historia == id_historia:
            print(h)
            return
    print(f"No se encontró ninguna historia médica con ID {id_historia}.")


def listar_historias():
    historias = _cargar_historias()
    print("\n--- Listado de Historias Médicas ---")
    if not historias:
        print("No hay historias médicas registradas.")
        return
    for h in historias:
        print(h)
        print("-" * 60)
    print(f"\nTotal: {len(historias)} historia(s) médica(s).")


def listar_historias_por_paciente():
    historias = _cargar_historias()
    print("\n--- Historias Médicas por Paciente ---")
    dni = input("Ingrese el DNI del paciente: ").strip()
    resultado = [h for h in historias if h.paciente_dni == dni]
    if not resultado:
        print(f"No se encontraron historias médicas para el paciente con DNI {dni}.")
        return
    for h in resultado:
        print(h)
        print("-" * 60)
    print(f"\nTotal: {len(resultado)} historia(s) médica(s).")
