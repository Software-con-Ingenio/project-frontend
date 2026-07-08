export async function crearGenero(event) {
    if (event) event.preventDefault();

    const inputNombre = document.getElementById('input-nombre-genero');
    const nombreGenero = inputNombre ? inputNombre.value.trim() : '';

    if (!nombreGenero) {
        alert('Ingresa un nombre de género');
        return;
    }

    const token = localStorage.getItem('access_token');

    try {
        // Intento 1: Como Query Parameter
        let response = await fetch(`http://localhost:8000/genres?nombre=${encodeURIComponent(nombreGenero)}`, {
            method: 'POST',
            headers: {
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
            alert("Género creado con éxito");
            location.reload();
        } else {
            let detalle = "No se pudo crear el género";

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
        tbody.innerHTML = ""; 

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
                btnEliminar.addEventListener('click', () => eliminarGenre(g.id_genero));
            }
            
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function eliminarGenre(id) {
    if (!confirm("¿Seguro que quieres eliminar este género?")) return;

    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:8000/genres/${id}`, {
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

// Compatibilidad por si algún botón viejo intenta llamar a la función
if (typeof window !== 'undefined') {
    window.eliminarGenre = eliminarGenre;
}