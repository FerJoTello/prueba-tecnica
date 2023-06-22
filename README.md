# Prueba Técnica - Fernando Tello

El presente proyecto fue elaborado usando el framework *NextJS*, que permite elaborar aplicaciones web full-stack. A su vez, se implementó una base de datos en MySQL para persistencia y consultas de información.

## Requisitos técnicos
La aplicación fue desarrollada con las siguientes herramientas y sus respectivas versiones, no obstante, es posible ejecutarla con versiones actualizadas.

- Windows 11
- NodeJS versión 18.14.0
  - Dependencias (ver [package.json](./aplicacion//package.json)):
    - next versión 13.4.6
    - react versión 18.2.0
    - mysql2 versión ^3.4.0
- MySQL 8.0 (Community)

## Configuración para ejecución de prototipo

### Instancia de base de datos
Es necesario desde un cliente de MySQL (como MYSQL Workbench) ejecutar los scripts de la base de datos ubicados en la carpeta `database`, la cual tiene dos archivos: [DDL01.sql](./database/DDL01.sql) y [DML01.sql](./database/DML01.sql).

Esto creará la base de datos e insertará la información de los productos necesaria para su funcionamiento.

### Aplicación en Next
#### .env
Configurar archivo [.env](./aplicacion/.env) en la carpeta `aplicacion` con las variables de entorno a utilizar. En esta se encuentran únicamente las credenciales y el nombre de la base de datos a utilizar; asegurarse que cumplan con las configuradas en su instancia.

#### Ejecución
Abrir una nueva terminal en la dirección del proyecto y ejecutar los siguientes comandos:
```bash
$ cd aplicacion
$ npm install
$ npm run dev
```
Esto levanta el servidor de desarrollo de la aplicación elaborada en Next, el cual por defecto se aloja en el puerto 3000 y es posible acceder a ella desde: http://localhost:3000/

## Explicación de la solución

### Base de datos
Fue necesario elaborar una base de datos, la cual se basa en el siguiente diagrama Entidad Relación.
![](./database/Diagrama%20Entidad%20Relacion.png)

En la tabla `producto_servicio` se registran los productos y servicios que se desean mostrar en la página con su detalle, la llave foránea de la columna `tipo` hace referencia a la tabla `tipo_producto_servicio` es un detalle que permite especificar si se trata de un producto o servicio en cuestión.

Se tienen las tablas `cliente`, `participacion` e `intereses_participacion_cliente`, las cuales son necesarias para el registro de la información necesaria según el enunciado.

### Backend
Se configuraron 2 endpoints para la consulta y registro de información para que el frontend los pueda consumir, estos se pueden encontrar en la carpeta `aplicacion/src/app/api`. 

#### Listado de endpoints:

**#01 - GET /api/productosServicios**

Listado de productos y servicios registrados en base de datos y que están disponibles para el evento.

*Entrada*:
- Headers: N/A
- Parámetros de entrada: N/A
- Body de entrada: N/A

*Salida*
- Formato: JSON
- Códigos de respuesta exitosa: `200`
- Parámetros de salida exitosa:

|Atributo|Tipo|Descripción|
|--|--|--|
|idProductoServicio|number|ID único registrado en base de datos del producto/servicio.|
|nombre|string|Nombre del producto/servicio.|
|descripcion|string|Descripción detallada del producto/servicio.|
|precio|string|Precio con formato de 2 decimales.|
|tipo|number|ID del tipo del producto/servicio. `1 = Producto` y `2 = Servicio` .|

- Códigos de respuesta fallida: `500`
- Parámetros de salida fallida:

|Atributo|Tipo|Descripción|
|--|--|--|
|message|string|Descripción del error ocurrido.|

Ejemplo de consumo en Javascript:
```js
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("/api/productosServicios", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```
Ejemplo de respuesta exitosa:
```json
//200
[
    {
        "idProductoServicio": 2,
        "nombre": "Insecticida",
        "descripcion": "Para el control de larvas de lepidopteros y trips.",
        "precio": "35.65",
        "tipo": 1
    },
    ...
]
```
Ejemplo de respuesta fallida:
```json
//500
{
    "message": "Ocurrió un error en el servidor."
}
```

**#02 POST /api/confirmarParticipacion**

Registra la información relacionada a la participación de un cliente en un evento.

*Entrada*:
- Headers:

|Header|Valor|
|--|--|
|Content-Type|application/json|

- Parámetros de entrada: N/A
- Body de entrada:

|Atributo|Tipo|Descripción|
|--|--|--|
|nombre|string|Nombre del cliente.|
|apellidos|string|Apellidos del cliente.|
|email|string|Correo electrónico del cliente.|
|fechaHoraParticipacion|string|Fecha con formato: `"YYYY-MM-DD HH:mm"`|
|listadoInteres|Object|JSON con detalle adicional.|
|descuentoProductos|string|Porcentaje de descuento en formato con 2 decimales. Solo se admite `"3.00"` o `"5.00"`.|
|descuentoServicios|string|Porcentaje de descuento en formato con 2 decimales. Solo se admite `"3.00"` o `"5.00"`.|
|idProductosServicios|number[]|Lista de IDs de productos y servicios que le interesan al cliente.|

*Salida*
- Formato: JSON
- Códigos de respuesta exitosa: `201`
- Parámetros de salida exitosa:

|Atributo|Tipo|Descripción|
|--|--|--|
|message|string|Mensaje de descripción exitoso.|
|idCliente|number|ID del cliente que se ha registrado.|
|idParticipacion|number|ID asociado a la participación en el evento del cliente.|

- Códigos de respuesta fallida: `400|500`
- Parámetros de salida fallida:

|Atributo|Tipo|Descripción|
|--|--|--|
|message|string|Descripción del error ocurrido.|

Ejemplo de consumo en Javascript:
```js
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "nombre": "Juan",
  "apellidos": "Perez",
  "email": "test3@test.com",
  "fechaHoraParticipacion": "2019-01-01 12:00",
  "listadoInteres": {
    "descuentoProductos": "3.00",
    "descuentoServicios": "5.00",
    "idProductosServicios": [2,3,4,5]
  }
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("/api/confirmarParticipacion", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```
Ejemplo de respuesta exitosa:
```json
//201
{
    "message": "Se ha registrado la participación correctamente.",
    "idCliente": 4,
    "idParticipacion": 3
}
```
Ejemplo de respuesta fallida:
```json
//400|500
{
    "message": "Ocurrió un error en el servidor."
}
```

### Frontend
Para el funcionamiento de la aplicación se elaboró una vista la cual se puede encontrar en el archivo [/aplicacion/app/page.tsx](./aplicacion/app/page.tsx), la cual se encarga de renderizar la información recuperada de los endpoints del backend y del funcionamiento de los componentes, asegurándose también que la vista sea agradable y ajustable a los distintos tamaños de los dispositivos (*responsive*).

- Vista de escritorio

![](/mockups/PantallaAppDesktop.png)

- Vista móvil

![](/mockups/PantallaAppMovil01.png) ![](/mockups/PantallaAppMovil02.png)