// Datos esenciales de la empresa
export const COMPANY_INFO = {
  rif: "J-50334170-0",
  nombre: "Ferre Materiales Madrid",
  direccion: "Av. Principal, Maturín, Venezuela",
  telefono: "+58 412-4111616",
  email: "Ferremat.Madrid@gmail.com"
}


export type Category = {
  id: string;
  name: string;
  slug: string;
};

export const categories: Category[] = [
  {
    id: "herramientas",
    name: "Herramientas",
    slug: "herramientas",
  },
  {
    id: "materiales",
    name: "Materiales",
    slug: "materiales",
  },
  {
    id: "electricidad",
    name: "Electricidad",
    slug: "electricidad",
  },
  {
    id: "plomeria",
    name: "Plomería",
    slug: "plomeria",
  },
  {
    id: "jardineria",
    name: "Jardinería",
    slug: "jardineria",
  },
  {
    id: "pinturas",
    name: "Pinturas",
    slug: "pinturas",
  },
]
