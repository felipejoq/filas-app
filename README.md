# Filas APP
Filas app, es un sitio web que permite crear filas para adminsitrar numeros de atención y ser anunciados ó llamados en tiempo real mediante una pantalla pública.

El administrador puede crear Filas, con las que podrá disponer de toma de números para sus clientes o usuarios. Además podrá crear encargados de la atención mediante la creación de "Escritorios de atención", los que serán encargados de atender y llamar los tickets o números de atención.

Los escritorios podrán comenzar la atencion de la fila con su número identificador asignado por el administrador y la clave global que este les compartirá.

### ¿Por qué?
Este proyecto fue desarrollado con motivo de aprender a programar con JavaScript (Y también con TypeScript) usando Node.js con Express como servidores y MongoDB como Gestor de Base de datos no relacional usando el ORM "Mongoose".

El proyecto usa además otras tecnologías o paquetes de node, instalados mediante el gestor npm, como por ejemplo, Socket.io, morgan, session, passport, node-cron, entre muchas otras (Revise el archivo packajge.json).

### Falta por hacer.
Esta es una versión Beta en pañales. Falta mejorar el manejo de sessiones y seguridad de rutas. Falta además, controlar y validar errores. Manejar de mejor forma la creación de usuarios y roles. Añadir estadísticas. Resetear la fila cuando cambia de día. Y quizás otras muchas cosas que se le puedan añadir para ir mejorando.

#### Para instalar de forma local.
- Necesita mongodb
- Node y npm
- Nodemon de forma global ó instalar en la carpeta del proyecto ``npm i nodemon -D``
- Ejecutar nodemon o node en la carpeta src ``node src/`` ó ``nodemon src/``

###### https://uncodigo.com