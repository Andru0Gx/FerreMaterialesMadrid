import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Bike } from "lucide-react"

export default function DeliverySection() {
    return (
        <section className="py-12">
            <div className="bg-section p-10 flex flex-col space-y-5">
                <h2 className="text-2xl sm:text-2xl font-bold text-foreground">
                    Delivery Solo en Maturín
                </h2>

                <div className="sm:flex-row flex flex-col sm:space-x-14 space-y-5 items-center">
                    <Image
                        src="/img/Delivery.webp"
                        alt="Delivery"
                        className="lg:size-96 sm:size-80 size-60 rounded-3xl"
                        width={384}
                        height={384}
                    />

                    <div className="flex flex-col space-y-5">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                            Rápido y Conveniente
                        </h3>
                        <p className="text-color-1 sm:text-base text-sm">
                            Disfruta de nuestro servicio de entrega a domicilio en
                            Maturín. Te llevamos tus productos directamente a tu
                            puerta.
                        </p>
                        <ul className="text-primary space-y-5 text-xs sm:text-base">
                            <li className="flex items-center space-x-2">
                                <Clock size="24" />
                                <p className="text-foreground">
                                    Entrega el mismo día para pedidos antes de las 4
                                    PM
                                </p>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin size="24" />
                                <p className="text-foreground">
                                    Cobertura en todo Maturín
                                </p>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Bike size="24" />
                                <p className="text-foreground">Facil y rápido</p>
                            </li>
                        </ul>

                        <Link href="/productos">
                            <Button
                                size="lg"
                                className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                            >
                                Hacer una compra
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
