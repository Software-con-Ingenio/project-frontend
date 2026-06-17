export async function crearGenero(event) {
    if (event) event.preventDefault();

    const nombreGenero = document.getElementById('input-nombre-genero').value;
    const token = localStorage.getItem('access_token');

    try {
        // Mandamos el nombre en la URL usando la variable "?nombre="
        const response = await fetch(`http://localhost:8000/genres?nombre=${encodeURIComponent(nombreGenero)}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        // Intento 2: Como JSON Body
        if (!response.ok && response.status >= 400) {
            response = await fetch('http://localhost:8000/genres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombreGenero,
                    nombre_genero: nombreGenero
                })
            });
        }

        if (response.ok) {
            mostrarNotificacion("¡Operación realizada con éxito!", "success");
            setTimeout(() => { location.reload(); }, 1500);
        } else {
            const error = await response.json();
            mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
        }

    } catch (err) {
        console.error("Error al crear género:", err);
        mostrarNotificacion("Error de conexión con el servidor", "error");
    }
}

export async function cargarGenres() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;

    try {
        const response = await fetch('http://localhost:8000/genres', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Error al cargar géneros");
        
        const genres = await response.json();
        const tbody = document.getElementById('tabla-genres-body');
        if (tbody) tbody.innerHTML = ""; 

        genres.forEach(g => {
            const fila = document.createElement('tr');
            
            let htmlFila = `<td>${g.id_genero}</td><td>${g.nombre_genero}</td>`;
            
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
                    btnEliminar.addEventListener('click', () => eliminarGenre(g.id_genero));
                }
            }
            
            if (tbody) tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
}

export async function eliminarGenre(id) {
    mostrarConfirmacion("¿Seguro que quieres eliminar este género?", async () => {
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`http://localhost:8000/genres/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                mostrarNotificacion("¡Operación realizada con éxito!", "success");
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                const error = await response.json();
                mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
            }
        } catch (err) {
            console.error("Error al eliminar género:", err);
            mostrarNotificacion("Error de conexión con el servidor", "error");
        }
    });
}

if (typeof window !== 'undefined') {
    window.eliminarGenre = eliminarGenre;
}