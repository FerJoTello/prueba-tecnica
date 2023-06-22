import database from "@/src/config/database"
import insertarCliente from "@/src/model/Cliente.model"
import insertarDetalle from "@/src/model/InteresParticipacionCliente"
import insertarParticipacion from "@/src/model/Participacion"
import HttpError from "http-errors"
import { NextRequest, NextResponse } from "next/server"

const DESCUENTOS_VALIDOS = ["3.00", "5.00"]

type ListadoInteres = {
    descuentoProductos: string,
    descuentoServicios: string,
    idProductosServicios: number[]
}

export async function POST(request: NextRequest) {

    const conn = await database.getConnection()
    try {
        //validación de parámetros
        let { nombre, apellidos, email, fechaHoraParticipacion, listadoInteres }: { nombre: string, apellidos: string, email: string, fechaHoraParticipacion: string, listadoInteres: ListadoInteres } = await request.json();

        if (!nombre || !apellidos || !email || !fechaHoraParticipacion || !listadoInteres) {
            throw new HttpError[400]("Faltan datos obligatorios.")
        }

        const errorListado = validarListadoInteres(listadoInteres)

        if (errorListado) {
            throw new HttpError[400](errorListado)
        }

        //inserción de datos
        await conn.beginTransaction()

        const resultInsertCliente = await insertarCliente(conn, nombre, apellidos, email)

        const idCliente = resultInsertCliente.insertId

        const resultInsertParticipacion = await insertarParticipacion(conn, idCliente, listadoInteres.descuentoServicios, listadoInteres.descuentoProductos, fechaHoraParticipacion)

        const idParticipacion = resultInsertParticipacion.insertId

        const resultInsertDetalle = await insertarDetalle(conn, idParticipacion, listadoInteres.idProductosServicios)

        if (resultInsertDetalle.affectedRows !== listadoInteres.idProductosServicios.length) {
            throw new HttpError[400]("No se insertó el detalle correctamente.")
        }

        await conn.commit()
        conn.release()

        //envío de respuesta
        return NextResponse.json({
            message: "Se ha registrado la participación correctamente.",
            idCliente: idCliente,
            idParticipacion: idParticipacion,
        }, { status: 201 })
    } catch (error: any) {
        await conn.rollback()
        conn.release()
        return NextResponse.json({ message: error.status ? error.message : "Ocurrió un error no esperado en el servidor." }, { status: error.status || 500 })
    }
}

function validarListadoInteres(listadoInteres: ListadoInteres) {
    if (!listadoInteres.descuentoProductos || !listadoInteres.descuentoServicios || !listadoInteres.idProductosServicios) {
        return "Faltan datos obligatorios."
    }
    
    if (!DESCUENTOS_VALIDOS.includes((listadoInteres.descuentoProductos)) ||! DESCUENTOS_VALIDOS.includes(listadoInteres.descuentoServicios)) {
        return "El descuento indicado no es válido."
    }

    if (listadoInteres.idProductosServicios.length === 0) {
        return "Debe seleccionar al menos un producto o servicio."
    }
}