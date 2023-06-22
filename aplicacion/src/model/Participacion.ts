import { ResultSetHeader } from "mysql2"
import HTTPError from "http-errors"
import { Connection } from "mysql2/promise"

export default async function insertarParticipacion(conn: Connection, idCliente: number, descuentoServicios: string, descuentoProductos: string, fechaHoraParticipacion: string) {
    const query = `INSERT INTO participacion (cliente, descuentoServicios, descuentoProductos, fechaHoraParticipacion) VALUES (?,?,?,?)`
    const [result] = await conn.execute(query, [idCliente, descuentoServicios, descuentoProductos, fechaHoraParticipacion]).catch((err) => {
        console.log(err)
        throw new HTTPError[500]('Ocurrió un error al registrar el listado')
    })
    return result as ResultSetHeader
}