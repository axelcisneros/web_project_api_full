# Tripleten web_project_around_express

## Proyecto 16: Alrededor de los EE.UU-express

Siguiendo con la creación de proyectos, en esta ocacion se crea el servidor para la aplicacion web usando nodeJS y express.

## Tecnologias usadas en el proyecto

- NodeJS
- GIT BASH
- GITHUB
- BRANCH
- API's
- MongoDBCompass
- Google Cloud
- Postman(pruebas)

## Dependencies

    "express": "^4.21.2"
    "mongoose": "^8.10.1"

## Developer Dependencies

    "eslint": "^8.56.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.31.0",
    "nodemon": "^3.1.9"

## Instal Dependencies and Dev

    npm install

## Funsionalidad

La pagina es una galeria de arte, en la que se muestran los lugares de donde provienen nuestros colegas, reunidos en la ciudad Triple Ten iniciando con la bienvenida y descripción:

    -Servidor express
    -Dar acceso a la Api mediante rutas
    -Utilizacion de mongoose para la conexión a la base de datos

## Rutas

Las rutas usan los metodos HTTP

      *Get: Obtención de datos(usuarios/tarjetas) unitarios mediante su ID o en su totalidad.
      *Put: Dar like a una tarjeta mediante su ID.
      *Post: Crear nuevos usuarios o tarjetas.
      *Patch: Actualizar la información de los usuarios(name, about, avatar) mediante su ID.
      *Delete: Borrar o dar dislike a una tarjeta mediante su ID.

## Mejoras

En un futuro se agregaran mas features como:

     -Conexión al Front
