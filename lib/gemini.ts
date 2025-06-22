// lib/gemini.ts


// Esta función ahora llama al endpoint interno de Next.js
export async function fetchGeminiCompletion(prompt: string): Promise<string> {
    const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error("Error en Gemini: " + error);
    }
    const data = await response.json();
    return data.text || "";
}
