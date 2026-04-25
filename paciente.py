import json
import os

ARCHIVO = os.path.join(os.path.dirname(__file__), "data", "pacientes.json")


class Paciente:
    def __init__(self, dni, nombre, apellido, fecha_nacimiento, telefono, direccion, email=""):
        self.dni = dni
        self.nombre = nombre
        self.apellido = apellido
        self.fecha_nacimiento = fecha_nacimiento
        self.telefono = telefono
        self.direccion = direccion
        self.email = email

    def to_dict(self):
        return {
            "dni": self.dni,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "fecha_nacimiento": self.fecha_nacimiento,
            "telefono": self.telefono,
            "direccion": self.direccion,
            "email": self.email,
        }

    @staticmethod
    def from_dict(data):
        return Paciente(
            data["dni"],
            data["nombre"],
            data["apellido"],
            data["fecha_nacimiento"],
            data["telefono"],
            data["direccion"],
            data.get("email", ""),
        )

    def __str__(self):
        return (
            f"DNI: {self.dni} | Nombre: {self.nombre} {self.apellido} | "
            f"Nacimiento: {self.fecha_nacimiento} | Tel: {self.telefono} | "
            f"Dirección: {self.direccion} | Email: {self.email}"
        )


def _cargar_pacientes():
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r", encoding="utf-8") as f:
        return [Paciente.from_dict(d) for d in json.load(f)]


def _guardar_pacientes(pacientes):
    os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
    with open(ARCHIVO, "w", encoding="utf-8") as f:
        json.dump([p.to_dict() for p in pacientes], f, ensure_ascii=False, indent=2)


def alta_paciente():
    pacientes = _cargar_pacientes()
    print("\n--- Alta de Paciente ---")
    dni = input("DNI: ").strip()
    if not dni:
        print("El DNI no puede estar vacío.")
        return
    if any(p.dni == dni for p in pacientes):
        print(f"Ya existe un paciente con DNI {dni}.")
        return
    nombre = input("Nombre: ").strip()
    apellido = input("Apellido: ").strip()
    fecha_nacimiento = input("Fecha de Nacimiento (dd/mm/aaaa): ").strip()
    telefono = input("Teléfono: ").strip()
    direccion = input("Dirección: ").strip()
    email = input("Email (opcional): ").strip()
    paciente = Paciente(dni, nombre, apellido, fecha_nacimiento, telefono, direccion, email)
    pacientes.append(paciente)
    _guardar_pacientes(pacientes)
    print(f"Paciente {nombre} {apellido} dado de alta correctamente.")


def baja_paciente():
    pacientes = _cargar_pacientes()
    print("\n--- Baja de Paciente ---")
    dni = input("Ingrese el DNI del paciente a dar de baja: ").strip()
    for p in pacientes:
        if p.dni == dni:
            confirmacion = input(
                f"¿Confirma dar de baja a {p.nombre} {p.apellido}? (s/n): "
            ).strip().lower()
            if confirmacion == "s":
                pacientes.remove(p)
                _guardar_pacientes(pacientes)
                print("Paciente dado de baja correctamente.")
            else:
                print("Operación cancelada.")
            return
    print(f"No se encontró ningún paciente con DNI {dni}.")


def modificar_paciente():
    pacientes = _cargar_pacientes()
    print("\n--- Modificación de Paciente ---")
    dni = input("Ingrese el DNI del paciente a modificar: ").strip()
    for p in pacientes:
        if p.dni == dni:
            print(f"Datos actuales: {p}")
            print("(Deje en blanco para mantener el valor actual)")
            nombre = input(f"Nombre [{p.nombre}]: ").strip() or p.nombre
            apellido = input(f"Apellido [{p.apellido}]: ").strip() or p.apellido
            fecha_nacimiento = (
                input(f"Fecha de Nacimiento [{p.fecha_nacimiento}]: ").strip()
                or p.fecha_nacimiento
            )
            telefono = input(f"Teléfono [{p.telefono}]: ").strip() or p.telefono
            direccion = input(f"Dirección [{p.direccion}]: ").strip() or p.direccion
            email = input(f"Email [{p.email}]: ").strip() or p.email
            p.nombre = nombre
            p.apellido = apellido
            p.fecha_nacimiento = fecha_nacimiento
            p.telefono = telefono
            p.direccion = direccion
            p.email = email
            _guardar_pacientes(pacientes)
            print("Paciente modificado correctamente.")
            return
    print(f"No se encontró ningún paciente con DNI {dni}.")


def consultar_paciente():
    pacientes = _cargar_pacientes()
    print("\n--- Consulta de Paciente ---")
    dni = input("Ingrese el DNI del paciente a consultar: ").strip()
    for p in pacientes:
        if p.dni == dni:
            print(p)
            return
    print(f"No se encontró ningún paciente con DNI {dni}.")


def listar_pacientes():
    pacientes = _cargar_pacientes()
    print("\n--- Listado de Pacientes ---")
    if not pacientes:
        print("No hay pacientes registrados.")
        return
    for p in pacientes:
        print(p)
    print(f"\nTotal: {len(pacientes)} paciente(s).")
