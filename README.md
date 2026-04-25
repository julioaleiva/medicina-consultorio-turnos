<<<<<<< HEAD
# Consultorio Demo

Demo web responsive para gestion basica de un consultorio medico.

## Stack

- Frontend: HTML, CSS y JavaScript puro en [public/index.html](public/index.html)
- Backend: Node.js + Express en [server/app.js](server/app.js)
- Base de datos demo: SQLite con inicializacion automatica en [server/db/init.js](server/db/init.js)

## Estructura

```text
Consultorio/
|-- public/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- server/
|   |-- db/
|   |   |-- connection.js
|   |   |-- init.js
|   |   `-- seed.js
|   |-- repositories/
|   |   |-- appointmentRepository.js
|   |   |-- clinicalRecordRepository.js
|   |   `-- patientRepository.js
|   |-- routes/
|   |   |-- appointments.js
|   |   |-- clinicalRecords.js
|   |   |-- dashboard.js
|   |   `-- patients.js
|   |-- utils/
|   |   `-- validation.js
|   |-- app.js
|   `-- config.js
|-- data/
|-- .gitignore
|-- package.json
`-- README.md
```

## Modulos incluidos

- Dashboard con total de pacientes, turnos del dia y proximos turnos.
- Pacientes con alta, edicion, listado y busqueda.
- Turnos con alta, edicion, vista por dia y estados.
- Historias clinicas con alta y consulta por paciente.
- Datos de ejemplo para una demo completa desde el primer arranque.

## Como correr la demo en tu PC

1. Instala Node.js 20 o superior.
2. Abre una terminal en la carpeta del proyecto.
3. Instala dependencias:

```bash
npm install
```

4. Inicia la app:

```bash
npm start
```

5. Abre en el navegador:

```text
http://localhost:3000
```

### Que corre en cada parte

- Frontend: los archivos de [public/index.html](public/index.html), [public/styles.css](public/styles.css) y [public/app.js](public/app.js). Se ejecutan en el navegador.
- Backend: [server/app.js](server/app.js), rutas y repositorios en [server/routes](server/routes) y [server/repositories](server/repositories). Se ejecutan en Node.js.
- Base SQLite: se crea sola en `data/consultorio.sqlite` al iniciar el servidor por primera vez.

## Compartir un link temporal con tu cliente

El servidor ya escucha en `0.0.0.0`, asi que puede exponerse con un tunel.

### Opcion A: Cloudflare Tunnel

1. Instala `cloudflared`.
2. Con la app levantada en `http://localhost:3000`, ejecuta:

```bash
cloudflared tunnel --url http://localhost:3000
```

3. Cloudflare te devolvera un link publico HTTPS temporal para compartir.

### Opcion B: ngrok

1. Instala `ngrok` y autenticalo una vez.
2. Con la app levantada en `http://localhost:3000`, ejecuta:

```bash
ngrok http 3000
```

3. Comparte la URL HTTPS que devuelve ngrok.

## Preparacion para Hostinger

### Lo que ya queda preparado

- Frontend y backend estan separados.
- La logica de acceso a datos esta concentrada en repositorios.
- La configuracion principal depende de variables de entorno simples (`HOST`, `PORT`, `DB_PATH`).
- No hay dependencias complejas ni framework acoplado al hosting.

### Si luego migras de SQLite a MySQL o MariaDB

1. Sustituye el adaptador de [server/db/connection.js](server/db/connection.js) por un cliente MySQL o MariaDB.
2. Mantiene la misma API en los repositorios para minimizar cambios en rutas y frontend.
3. Conviene mover el esquema a migraciones SQL versionadas.
4. En produccion, agrega autenticacion, sesiones, logs y backups.

### Recomendaciones para desplegar en Hostinger con Node.js

1. Usa un plan con soporte Node.js.
2. Define variables de entorno para `PORT`, `HOST` y credenciales de base si migras a MySQL/MariaDB.
3. Sirve el frontend estatico desde Express o separalo luego en un CDN si el proyecto crece.
4. Si el hosting no permite SQLite persistente confiable, migra la base a MySQL/MariaDB antes de pasar a produccion.
5. Configura un proceso persistente con PM2 o el administrador de procesos que ofrezca Hostinger.

## Notas de evolucion

- Para una segunda etapa se puede agregar login, profesionales multiples, calendario semanal y exportacion.
- Si el cliente aprueba, la migracion a una base relacional de hosting compartido sera directa porque la UI no depende del motor de base de datos.
=======
# medicina-consultorio-turnos
>>>>>>> 1b7379a57140d38ee733f7a0b66c40fa2a9ecbfa
