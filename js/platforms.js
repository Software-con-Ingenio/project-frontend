export async function cargarPlatforms() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;
    
    try {
        const response = await fetch('http://localhost:8000/platforms');
        const platforms = await response.json();
        const tbody = document.getElementById('tabla-platforms-body');
        
        tbody.innerHTML = "";

        platforms.forEach(p => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${p.id_plataforma}</td>
                <td>${p.nombre_plataforma}</td>
                <td><button onclick="eliminarPlatform(${p.id_plataforma})">Eliminar</button></td>
            `;
            tbody.appendChild(fila);
        });
    } catch (e) { console.error("Error cargando platforms", e); }
}

export async function crearPlatform() {
    const nombre = document.getElementById('input-nombre-plataforma').value;
    if (!nombre) return alert("Escribe un nombre");

    // Manteniendo la estructura de enviar el parámetro por URL como en tu código de genres
    const response = await fetch(`http://localhost:8000/platforms?nombre=${encodeURIComponent(nombre)}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
        }
    });
    
    if (response.ok) {
        document.getElementById('input-nombre-plataforma').value = "";
        cargarPlatforms();
    } else {
        const errorData = await response.json();
        const mensaje = errorData.detail || "Error desconocido";
        alert("Error: " + mensaje);
        console.error("Detalle completo del error:", errorData);
    }
}