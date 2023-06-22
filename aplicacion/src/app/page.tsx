'use client'

import { useEffect, useState } from "react"
import { ProductoServicio, TIPO_PRODUCTO, TIPO_SERVICIO } from "../model/ProductoServicio.model"

type Servicio = ProductoServicio & { isChecked: boolean | undefined }

export default function Home() {
  const [Nombre, setNombre] = useState('')
  const [Apellidos, setApellidos] = useState('')
  const [Email, setEmail] = useState('')
  const [FechaHora, setFechaHora] = useState('')
  const [Busqueda, setBusqueda] = useState('')

  const [DescuentoServicios, setDescuentoServicios] = useState(0)
  const [DescuentoProductos, setDescuentoProductos] = useState(0)

  const [Servicios, setServicios]: [Servicio[], any] = useState([])
  const [ServiciosBusqueda, setServiciosBusqueda]: [Servicio[], any] = useState([])

  const [cargandoEnvio, setCargandoEnvio] = useState(false)

  useEffect(() => {
    const initComponent = async () => {
      const result = await fetch('/api/productosServicios')

      if (!result.ok) throw new Error('Error al obtener los productos y servicios')

      const data = await result.json()
      setServicios(data)
    }
    initComponent()
  }, [])

  useEffect(() => {
    let descuentoServicios = 0
    let descuentoProductos = 0

    const serviciosSeleccionados = Servicios
      .filter(servicio => servicio.tipo === TIPO_SERVICIO)
      .filter(servicio => servicio.isChecked)

    if (serviciosSeleccionados.length >= 2) {
      const totalServicios = serviciosSeleccionados.reduce((total, servicio) => total + parseFloat(servicio.precio), 0)
      descuentoServicios = totalServicios > 1500 ? 5 : 3
    }

    const productosSeleccionados = Servicios
      .filter(servicio => servicio.tipo === TIPO_PRODUCTO)
      .filter(servicio => servicio.isChecked)


    if (productosSeleccionados.length >= 5) {
      descuentoProductos = 5
    } else if (productosSeleccionados.length >= 3) {
      descuentoProductos = 3
    }

    setDescuentoServicios(descuentoServicios)
    setDescuentoProductos(descuentoProductos)
  }, [Servicios])

  const handleCheckboxClick = (id: number) => {
    const newArray = [...Servicios];
    const selectedIndex = newArray.findIndex(servicio => servicio.idProductoServicio === id)
    newArray[selectedIndex].isChecked = !newArray[selectedIndex].isChecked;
    setServicios(newArray);
  };

  const handleSubmitButton = async () => {
    setCargandoEnvio(true)
    const serviciosSeleccionados = Servicios.filter(servicio => servicio.isChecked).map(servicio => servicio.idProductoServicio)

    const response = await fetch('/api/confirmarParticipacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: Nombre,
        apellidos: Apellidos,
        email: Email,
        fechaHoraParticipacion: FechaHora.replace('T', ' '),
        listadoInteres: {
          descuentoProductos: DescuentoProductos.toFixed(2),
          descuentoServicios: DescuentoServicios.toFixed(2),
          idProductosServicios: serviciosSeleccionados
        }
      })
    })

    const data = await response.json()

    response.ok ? alert('Participación confirmada') : alert('Error al confirmar participación: ' + data.message || '')

    setNombre('')
    setApellidos('')
    setEmail('')
    setFechaHora('')
    setBusqueda('')
    setDescuentoServicios(0)
    setDescuentoProductos(0)

    setCargandoEnvio(false)
  }

  return (
    <main className="container">
      <div className="row row-cols-1 row-cols-lg-2 mt-1 gy-4">
        <div className="col">
          <h4 className="text-center">
            <span className="badge rounded-pill bg-success mx-2">1</span>Ingrese su información
          </h4>
        </div>
        <div className="col order-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <form>
                <div className="form-group my-2">
                  <label htmlFor="nombreInput" className="form-label">Nombre:</label>
                  <input type="text" className="form-control" id="nombreInput" placeholder="Nombre" onChange={e => setNombre(e.target.value)}
                  />
                </div>
                <div className="form-group my-2">
                  <label htmlFor="ApellidosInput" className="form-label">Apellidos:</label>
                  <input type="text" className="form-control" id="ApellidosInput" placeholder="Apellidos" onChange={e => setApellidos(e.target.value)}
                  />
                </div>
                <div className="form-group my-2">
                  <label htmlFor="EmailInput" className="form-label">Email:</label>
                  <input type="text" className="form-control" id="EmailInput" placeholder="email@ejemplo.com" onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group my-2">
                  <label htmlFor="fechaHoraInput" className="form-label">Fecha y Hora:</label>
                  <input type="datetime-local" className="form-control" id="fechaHoraInput" onChange={e => setFechaHora(e.target.value)}
                  />
                  <small id="fechaHelp" className="form-text text-muted">Seleccione Fecha y Hora en que asistirá.</small>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col">
          <h4 className="text-center">
            <span className="badge rounded-pill bg-success mx-2">2</span> Seleccione Servicios y Productos de su interés.
          </h4>
        </div>
        <div className="col order-lg-5">
          <div className="card text-center">
            <div className="card-header text-bg-dark">
              <form className="row row-cols-sm-auto g-3 align-items-center">
                <div className="col-12 mx-auto">
                  <input type="text" className="form-control" id="busquedaInput" placeholder="Buscar Servicios y Productos" onChange={e => {
                    setBusqueda(e.target.value)
                    setServiciosBusqueda(Servicios.filter(servicio => servicio.nombre.includes(e.target.value)))
                  }}
                  />
                </div>
              </form>
            </div>
            <div className="card-body">
              <h6 className="card-title">Servicios y productos seleccionados:</h6>
              <div style={{
                height: "35vh",
                overflow: "auto",
                textAlign: "justify",
              }}>
                <ul className="list-group">
                  {(Busqueda.length === 0 ? Servicios : ServiciosBusqueda)?.map((servicio, index) => (
                    <li key={servicio.idProductoServicio} className="list-group-item">
                      <div className="row">
                        <div className="col-auto pe-0">
                          <input className="form-check-input" type="checkbox" checked={servicio.isChecked} id={`servicio-${servicio.idProductoServicio}`} onChange={() => handleCheckboxClick(servicio.idProductoServicio)} />
                        </div>
                        <div className="col">
                          <label className="form-check-label stretched-link" htmlFor={`servicio-${servicio.idProductoServicio}`}>
                            {servicio.nombre}
                          </label>
                        </div>
                        <div className="col-auto me-auto">
                          <strong>Q.{servicio.precio}</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                  {Busqueda.length > 0 && ServiciosBusqueda.length === 0 && (
                    <li className="text-center">No se hallaron productos...</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="card-footer text-bg-dark">
              <div className="row">
                <div className="col">
                  <p className="text-center">Descuento obtenido en Servicios:</p>
                  <h5 className="text-success">{DescuentoServicios}%</h5>
                </div>
                <div className="col">
                  <p className="text-center">Descuento obtenido en Productos:</p>
                  <h5 className="text-success">{DescuentoProductos}%</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-5 justify-content-center justify-content-lg-end">
        <div className="col-auto">
          {!cargandoEnvio ? (
            <button className="btn btn-primary btn-lg" onClick={handleSubmitButton}>
              Confirmar Asistencia
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Enviando...
            </button>
          )}
        </div>
      </div>
    </main >
  )
}
