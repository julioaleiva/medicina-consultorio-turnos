"""
Sistema de Gestión - Consultorio Médico
========================================
Módulos:
  - Pacientes      : Alta, Baja, Modificación, Consulta, Listado
  - Turnos         : Alta, Baja, Modificación, Consulta, Listado, Listado por Paciente
  - Historias Médicas: Alta, Baja, Modificación, Consulta, Listado, Listado por Paciente

Los datos se almacenan en archivos JSON dentro del directorio 'data/'.
"""

from paciente import (
    alta_paciente,
    baja_paciente,
    modificar_paciente,
    consultar_paciente,
    listar_pacientes,
)
from turno import (
    alta_turno,
    baja_turno,
    modificar_turno,
    consultar_turno,
    listar_turnos,
    listar_turnos_por_paciente,
)
from historia_medica import (
    alta_historia,
    baja_historia,
    modificar_historia,
    consultar_historia,
    listar_historias,
    listar_historias_por_paciente,
)


def menu_pacientes():
    opciones = {
        "1": ("Alta de Paciente", alta_paciente),
        "2": ("Baja de Paciente", baja_paciente),
        "3": ("Modificación de Paciente", modificar_paciente),
        "4": ("Consulta de Paciente", consultar_paciente),
        "5": ("Listar todos los Pacientes", listar_pacientes),
        "0": ("Volver al Menú Principal", None),
    }
    while True:
        print("\n========== Gestión de Pacientes ==========")
        for clave, (descripcion, _) in opciones.items():
            print(f"  {clave}. {descripcion}")
        opcion = input("Seleccione una opción: ").strip()
        if opcion == "0":
            break
        elif opcion in opciones:
            _, accion = opciones[opcion]
            accion()
        else:
            print("Opción inválida. Intente nuevamente.")


def menu_turnos():
    opciones = {
        "1": ("Alta de Turno", alta_turno),
        "2": ("Baja de Turno", baja_turno),
        "3": ("Modificación de Turno", modificar_turno),
        "4": ("Consulta de Turno por ID", consultar_turno),
        "5": ("Listar todos los Turnos", listar_turnos),
        "6": ("Listar Turnos por Paciente", listar_turnos_por_paciente),
        "0": ("Volver al Menú Principal", None),
    }
    while True:
        print("\n========== Gestión de Turnos ==========")
        for clave, (descripcion, _) in opciones.items():
            print(f"  {clave}. {descripcion}")
        opcion = input("Seleccione una opción: ").strip()
        if opcion == "0":
            break
        elif opcion in opciones:
            _, accion = opciones[opcion]
            accion()
        else:
            print("Opción inválida. Intente nuevamente.")


def menu_historias():
    opciones = {
        "1": ("Alta de Historia Médica", alta_historia),
        "2": ("Baja de Historia Médica", baja_historia),
        "3": ("Modificación de Historia Médica", modificar_historia),
        "4": ("Consulta de Historia Médica por ID", consultar_historia),
        "5": ("Listar todas las Historias Médicas", listar_historias),
        "6": ("Listar Historias Médicas por Paciente", listar_historias_por_paciente),
        "0": ("Volver al Menú Principal", None),
    }
    while True:
        print("\n========== Gestión de Historias Médicas ==========")
        for clave, (descripcion, _) in opciones.items():
            print(f"  {clave}. {descripcion}")
        opcion = input("Seleccione una opción: ").strip()
        if opcion == "0":
            break
        elif opcion in opciones:
            _, accion = opciones[opcion]
            accion()
        else:
            print("Opción inválida. Intente nuevamente.")


def menu_principal():
    opciones = {
        "1": ("Gestión de Pacientes", menu_pacientes),
        "2": ("Gestión de Turnos", menu_turnos),
        "3": ("Gestión de Historias Médicas", menu_historias),
        "0": ("Salir", None),
    }
    print("\n" + "=" * 50)
    print("   SISTEMA DE GESTIÓN - CONSULTORIO MÉDICO")
    print("=" * 50)
    while True:
        print("\n---------- Menú Principal ----------")
        for clave, (descripcion, _) in opciones.items():
            print(f"  {clave}. {descripcion}")
        opcion = input("Seleccione una opción: ").strip()
        if opcion == "0":
            print("\nHasta luego.\n")
            break
        elif opcion in opciones:
            _, accion = opciones[opcion]
            accion()
        else:
            print("Opción inválida. Intente nuevamente.")


if __name__ == "__main__":
    menu_principal()
