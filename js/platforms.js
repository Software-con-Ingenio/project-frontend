// js/platforms.js

export async function crearPlatform(event) {
    if (event) event.preventDefault();

    // 1. Capturamos el valor del input
    const nombrePlataforma = document.getElementById('input-nombre-plataforma').value;
    const token = localStorage.getItem('access_token');

    try {
        // 2. Pasamos el nombre en la URL (?nombre=...) y quitamos el "body"
        const response = await fetch(`http://localhost:8000/platforms?nombre=${encodeURIComponent(nombrePlataforma)}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            mostrarNotificacion("¡Operación realizada con éxito!", "success");
            setTimeout(() => { location.reload(); }, 1500);
        } else {
            const error = await response.json();
            mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
        }
    } catch (err) {
        console.error("Error al crear plataforma:", err);
        mostrarNotificacion("Error de conexión con el servidor", "error");
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
        if (tbody) tbody.innerHTML = ""; 

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
                if (btnEliminar) {
                    btnEliminar.addEventListener('click', () => eliminarPlatform(p.id_plataforma));
                }
            }
            
            if (tbody) tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar plataformas:", error);
    }
}

export async function eliminarPlatform(id) {
    mostrarConfirmacion("¿Seguro que quieres eliminar esta plataforma?", async () => {
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`http://localhost:8000/platforms/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                mostrarNotificacion("¡Eliminado con éxito!", "success");
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                const error = await response.json();
                mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
            }
        } catch (err) {
            console.error("Error al eliminar plataforma:", err);
            mostrarNotificacion("Error de conexión con el servidor", "error");
        }
    });
}

// Compatibilidad con cualquier botón inline viejo que siga llamando a la función desde HTML.
if (typeof window !== 'undefined') {
    window.eliminarPlatform = eliminarPlatform;
}