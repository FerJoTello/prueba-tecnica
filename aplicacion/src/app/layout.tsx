import './bootstrap.min.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Disagro - Feria de Promociones 2023',
  description: 'Prueba Técnica - Fernando Tello',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header>
          <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <a className="navbar-brand" href="#">Disagro</a>
                  </div>
                  <div className="row">
                    <div className="col">
                      <a style={{ color: 'white', textDecoration: 'none', fontSize: '90%' }} className="nav-brand" href='#'>Feria de Promociones - 2023</a>
                    </div>
                  </div>
                </div>
              </div>
              {/*<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
               <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav me-auto">
                </ul>
              </div> */}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
