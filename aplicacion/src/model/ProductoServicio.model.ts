import HTTPError from "http-errors"
import { Connection } from "mysql2/promise"

export const TIPO_PRODUCTO = 1
export const TIPO_SERVICIO = 2

type TipoProducto = 1
type TipoServicio = 2

export type ProductoServicio = {
    idProductoServicio: number,
    nombre: string,
    descripcion: string,
    precio: `${number}.${number}`,
    tipo: TipoProducto | TipoServicio
}

const LIMIT = 10

export default async function selectAll(conn: Connection, page: number = 1) {
    const query = `SELECT * FROM producto_servicio LIMIT ? OFFSET ?`
    const [result] = await conn.query(query, [LIMIT, LIMIT * (page - 1)]).catch((err) => {
        console.log(err)
        throw new HTTPError[500]('Ocurrió un error al recuperar los datos.')
    })
    return result as ProductoServicio[]
}