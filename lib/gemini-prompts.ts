// Prompts para Gemini AI para los diferentes campos del formulario de productos

export const PROMPT_SHORT_DESCRIPTION = (
    productName: string
) => `Eres un redactor profesional de catálogos de productos. Escribe una sola descripción breve (máximo 200 caracteres) para un producto llamado "${productName}". Responde solo con el texto, en una sola línea, usando únicamente signos de puntuación convencionales (punto, coma, punto y coma, dos puntos, signos de exclamación o interrogación), pero no uses ningún símbolo de markdown como #, *, \`, ~, -, _, >, [, ], (, ), ni ningún otro símbolo especial fuera de la puntuación normal. No incluyas comillas. Devuelve solo una opción, sin alternativas, sin listas, sin instrucciones adicionales. Ejemplo de respuesta: ¡Potencia y versatilidad para taladrar con y sin percusión! no agregues el nombre del producto, ya que ya se encuentra en el título del producto.`;

export const PROMPT_DESCRIPTION = (
    productName: string
) => `Eres un redactor profesional de catálogos de productos. Escribe una sola descripción completa y persuasiva para un producto llamado "${productName}". Responde solo con texto plano, en párrafos, usando únicamente signos de puntuación convencionales (punto, coma, punto y coma, dos puntos, signos de exclamación o interrogación), pero no uses ningún símbolo de markdown como #, *, \`, ~, -, _, >, [, ], (, ), ni ningún otro símbolo especial fuera de la puntuación normal. No incluyas comillas. No incluyas títulos, listas, secciones, encabezados, ni notas. Devuelve solo una opción, sin alternativas, sin instrucciones adicionales, como si fuera el cuerpo de una ficha de producto en una tienda online.`;

export const PROMPT_SPECIFICATIONS = (
    productName: string
) => `Eres un experto en fichas técnicas. Genera una lista de especificaciones técnicas para un producto llamado "${productName}". Devuelve solo un array JSON de objetos con las claves 'title' y 'value', sin texto adicional, sin formato markdown, sin títulos, sin instrucciones ni explicaciones. Ejemplo: [{"title": "Potencia", "value": "800W"}]`;

export const PROMPT_PRICE = (
    productName: string
) => `Eres un experto en análisis de mercado. Sugiere un precio en dólares para un producto llamado "${productName}" considerando el mercado latinoamericano. Responde solo con el número, sin símbolos, sin texto adicional, sin formato markdown, sin explicaciones ni instrucciones.`;
