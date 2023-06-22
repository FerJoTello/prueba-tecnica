import database from '@/src/config/database'
import selectAll from '@/src/model/ProductoServicio.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const conn = await database.getConnection()
    try {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')

        const productosServicios = await selectAll(conn, page)

        conn.release()
        return NextResponse.json(productosServicios, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
