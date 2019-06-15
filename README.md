# Sistema de envíos

**Contexto:** Imaginemos que un cliente solicita el envío de un pedido mediante una llamada a una API REST para almacenarlo en la base de datos. El pedido debe contener:

* Nombre y apellidos del cliente
* Email (Único por cliente)
* Teléfono
* Dirección de entrega (sólo puede existir una por pedido y muchas por usuario)
* Fecha de entrega
* Franja de hora seleccionada para la entrega (variable, pueden ser desde franjas de 1h hasta de 8h)

Una vez tenemos guardada la información del pedido, debe asignarse a un driver que tengamos dado de alta en el sistema de forma aleatoria.

Por otro lado, nuestros drivers mediante su aplicación, necesitan obtener el listado de tareas para completar en el día. Es necesario contar con un endpoint que reciba como parámetro el ID del driver y la fecha de los pedidos que queremos obtener y nos devuelve un JSON con el listado.

**Consideraciones importantes:** Los *Drivers* se asume que ya están en la base de datos, por eso en el index se agregan a la base de datos 4 drivers por defecto

## Endpoint disponibles

* `/registro`: Este endpoint se encarga de registrar los *Clientes* del servicio, recibe por **POST** la siguiente estructura:

```json
{
    "name": "Un nombre",
    "email": "Un email único",
    "phone": "Un teléfono",
    "password": "Una contraseña",
    "addresses": [
        "Un listado",
        "De direecciones"
    ]
}
```

Y retorna una estructura de este tipo:

```json
{
    "name": "Un nombre",
    "email": "Un email único",
    "phone": "Un teléfono",
    "id": 1
}
```

* `/login`: Este endpoint se encarga de autenticar los *Clientes* del servicio, recibe por **POST** la siguiente estructura:

```json
{
    "email": "Un email único",
    "password": "Una contraseña"
}
```

Y retorna una estructura de este tipo:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTYwNjE1ODUzfQ.9ZJ0stbD6CTW-M6Yi7864rvWJyK7CKjSVHtwjqOBX-o"
}
```

* `/pedidos`: Este endpoint se encarga de crear los *Pedidos* en el servicio, recibe por **POST** la siguiente estructura:

```json
{
	"timeStart": 1,
	"timeEnd": 5,
	"address": 2,
	"product": "NOMBRE DEL ELEMENTO QUE SE VA A ENVIAR",
	"date": "06/25/2019"
}
```
**Nota:** `timeStart` y `timeEnd` están en formato 24h, cada valor hace referencia a una hora del día, `date` puede ser en formato `mm/dd/yyyy` o `mm-dd-yyyy`, `address` hace referencia al `id` de la dirección del usuario, este id debe estar asociado al usuario que hace la petición, sino arroja un error.
Para poder hacer una petición a este endpoint se debe enviar el header de autorización en el siguiente formato: `Authorization: Bearer jwt_token`

Y retorna una estructura de este tipo:

```json
{
    "id": 1,
    "product": "NOMBRE DEL ELEMENTO QUE SE VA A ENVIAR",
    "date": "2019-06-25T00:00:00.000Z",
    "timeStart": 1,
    "timeEnd": 5,
    "DriverId": 33,
    "ClientName": "Un nombre",
    "ClientEmail": "Un email único",
    "ClientPhone": "Un teléfono",
    "ClientAddress": "De direecciones"
}
```

* `/pedidos/:DriverId`: Este endpoint se encarga de listar los *Pedidos* de un driver específico, recibe por **GET** el parámetro `date` con la fecha.
Eg.: `/pedidos/33?date=06/25/2019`

**Nota:** `date` puede ser en formato `mm/dd/yyyy` o `mm-dd-yyyy`.
Para poder hacer una petición a este endpoint se debe enviar el header de autorización en el siguiente formato: `Authorization: Bearer jwt_token`

Y retorna una estructura de este tipo:

```json
[
    {
        "id": 1,
        "product": "NOMBRE DEL ELEMENTO QUE SE VA A ENVIAR",
        "date": "2019-06-25T00:00:00.000Z",
        "timeStart": 1,
        "timeEnd": 5,
        "ClientName": "Un nombre",
        "ClientEmail": "Un email único",
        "ClientPhone": "Un teléfono",
        "ClientAddress": "De direecciones"
    }
]
```

## Modelo de bae de datos

![Modelo de bae de datos](https://github.com/Dario0117/delivery-system/blob/master/db.png)