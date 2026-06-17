const API_BASE_URL = 'http://localhost:8000'; // La URL donde corre tu FastAPI

export async function obtenerDatos(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) throw new Error('Error en la conexión');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
