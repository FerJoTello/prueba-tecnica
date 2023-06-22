import { ResultSetHeader } from "mysql2"
import HTTPError from "http-errors"
import { Connection } from "mysql2/promise"

export default async function insertarCliente(conn: Connection, nombre: string, apellidos: string, email: string) {
    const query = `INSERT INTO cliente (nombre, apellidos, email) VALUES (?,?,?)`
    const [result] = await conn.execute(query, [nombre, apellidos, email]).catch((err) => {
        console.log(err)
        if (err.code === 'ER_DUP_ENTRY') {
            throw new HTTPError[400]('El email ya existe')
        }
        throw new HTTPError[500]('Ocurrió un error al registrar el cliente')
    })
    return result as ResultSetHeader
}