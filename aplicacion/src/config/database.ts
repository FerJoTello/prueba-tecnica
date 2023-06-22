//mysql or mysql2 npm package are availables
import { createConnection, createPool } from 'mysql2';

const DB_NAME = process.env.DB_NAME || 'db_name'

const params = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
    host: process.env.DB_HOST,
    multipleStatements: true,
}


const initDatabaseConfig = async () => {
    const conn = createConnection(params)
    if (!conn) {
        throw new Error(`No se pudo conectar a la Base de Datos: "${DB_NAME}"`)
    }
    conn.connect((err) => {
        if (err) throw new Error(`No se pudo conectar a la Base de Datos: "${DB_NAME}"`)
        console.log(`Conectado a base de datos: "${DB_NAME}"`)
    })
}
//initDatabaseConfig()
const pool = createPool(params)

export default pool.promise()

