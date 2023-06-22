import { ResultSetHeader } from "mysql2"
import HTTPError from "http-errors"
import { Connection } from "mysql2/promise"

export default async function insertarDetalle(conn: Connection, idParticipacion: number, idProductoServicio: number[]) {
    const values = idProductoServicio.map(id => [id, idParticipacion])
    const query = `INSERT INTO interes_participacion_cliente(ProductoServicio, Participacion) VALUES ?`
    const [result] = await conn.query(query, [values]).catch((err) => {
        console.log(err)
        throw new HTTPError[500]('Ocurrió un error al registrar el detalle')
    })
    
    return result as ResultSetHeader
}