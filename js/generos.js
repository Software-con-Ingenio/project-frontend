
export async function cargarGenres() {


    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;
    //ahi pa arriba es lo q copilot hace pa q solo se muestre al admin
    try {
        const response = await fetch('http://localhost:8000/genres'); // URL con /genres
        const genres = await response.json();
        const tbody = document.getElementById('tabla-genres-body');
        
        tbody.innerHTML = "";

        genres.forEach(g => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${g.id_genero}</td>
                <td>${g.nombre_genero}</td>
                <td><button onclick="eliminarGenre(${g.id_genero})">Eliminar</button></td>
            `;
            tbody.appendChild(fila);
        });
    } catch (e) { console.error("Error cargando genres", e); }
}

export async function crearGenero() {
    const nombre = document.getElementById('input-nombre-genero').value;
    if (!nombre) return alert("Escribe un nombre");

    const response = await fetch(`http://localhost:8000/genres?nombre=${encodeURIComponent(nombre)}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
        }
    });
    
    if (response.ok) {
        document.getElementById('input-nombre-genero').value = "";
        cargarGenres();
    } else {
        const errorData = await response.json();

        const mensaje = errorData.detail || "Error desconocido";
        alert("Error: " + mensaje);
        console.error("Detalle completo del error:", errorData);
        

    }
}