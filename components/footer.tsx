import { Instagram, MapPin, Phone, Clock, Copyright } from "lucide-react"
import { COMPANY_INFO } from "@/lib/data"

export default function Footer() {
  return (
    <footer>
      <div className="bg-[var(--color-3)] w-full flex space-y-reverse space-y-10 flex-col-reverse p-6 items-center justify-center lg:flex-row lg:space-y-0 lg:justify-between lg:items-start">
        <ul className="flex flex-col justify-center space-y-4 h-full text-white text-sm w-full items-start">
          <li>
            <a
              href="https://www.instagram.com/ferrematerialesmadrid/"
              target="_blank"
              className="flex items-center space-x-5"
              rel="noreferrer"
            >
              <Instagram className="h-5 w-5" />
              <span>@ferrematerialesmadrid </span>
            </a>
          </li>

          <li>
            <a
              href={`https://wa.me/${COMPANY_INFO.telefono.replace(/\D/g, "")}`}
              target="_blank"
              className="flex items-center space-x-5"
              rel="noreferrer"
            >
              <Phone className="h-5 w-5" />
              <span>{COMPANY_INFO.telefono} </span>
            </a>
          </li>

          <li>
            <div className="flex items-center space-x-5">
              <Clock className="h-5 w-5" />

              <span>Lunes a Sabado | 9:00 AM - 5:00 PM</span>
            </div>
          </li>

          <li>
            <div className="flex items-center space-x-5">
              <MapPin className="h-5 w-5" />
              <span>{COMPANY_INFO.email}</span>
            </div>
          </li>

          <li>© {new Date().getFullYear()} {COMPANY_INFO.nombre}. Todos los derechos reservados.</li>
        </ul>
      </div>
    </footer>
  )
}
