// js/platforms.js

export async function crearPlatform(event) {
    if (event) event.preventDefault();

    const inputNombre = document.getElementById('input-nombre-plataforma');
    const nombrePlataforma = inputNombre ? inputNombre.value.trim() : '';

    if (!nombrePlataforma) {
        alert('Ingresa un nombre de plataforma');
        return;
    }

    const token = localStorage.getItem('access_token');

    try {
        // Compatibilidad con backend actual (query param) y contratos anteriores (JSON body).
        let response = await fetch(`http://localhost:8000/platforms?nombre=${encodeURIComponent(nombrePlataforma)}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok && (response.status === 400 || response.status === 404 || response.status === 405 || response.status === 415 || response.status === 422)) {
            response = await fetch('http://localhost:8000/platforms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombrePlataforma,
                    nombre_plataforma: nombrePlataforma
                })
            });
        }

        if (response.ok) {
            alert("Plataforma creada con éxito");
            location.reload(); 
        } else {
            let detalle = "No se pudo crear la plataforma";
        try {
            const error = await response.json();
            detalle = error.detail || detalle;
        } catch {
            console.log("No fue posible obtener el detalle del error");
        }
            alert("Error: " + detalle);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error de conexión con el servidor");
    }
}

export async function cargarPlatforms() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;

    try {
        const response = await fetch('http://localhost:8000/platforms', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Error al cargar plataformas");
        
        const platforms = await response.json();
        const tbody = document.getElementById('tabla-platforms-body');
        tbody.innerHTML = ""; 

        platforms.forEach(p => {
            const fila = document.createElement('tr');
            
            let htmlFila = `<td>${p.id_plataforma}</td><td>${p.nombre_plataforma}</td>`;
            
            if (esAdmin) {
                htmlFila += `<td>
                        <button class="btn-eliminar">Eliminar</button>
                    </td>`;
            } else {
                htmlFila += `<td>-</td>`;
            }
            
            fila.innerHTML = htmlFila;

            if (esAdmin) {
                const btnEliminar = fila.querySelector('.btn-eliminar');
                btnEliminar.addEventListener('click', () => eliminarPlatform(p.id_plataforma));
            }
            
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function eliminarPlatform(id) {
    if (!confirm("¿Seguro que quieres eliminar esta plataforma?")) return;

    const token = localStorage.getItem('access_token');
    // Usamos 'id' aquí porque es lo que espera tu ruta después de corregir el router
    const response = await fetch(`http://localhost:8000/platforms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert("Eliminado");
        location.reload();
    } else {
        alert("Error al eliminar");
    }
}

// Compatibilidad con cualquier botón inline viejo que siga llamando a la función desde HTML.
if (typeof window !== 'undefined') {
    window.eliminarPlatform = eliminarPlatform;
}