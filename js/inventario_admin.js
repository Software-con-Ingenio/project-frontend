let juegosData = []; 

export async function cargarInventarioAdmin() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;
    
    try {
        const response = await fetch('http://localhost:8000/juegos');
        juegosData = await response.json(); 
        renderizarTabla(juegosData);        
    } catch (e) { 
        console.error("Error cargando inventario", e); 
    }
}

function renderizarTabla(lista) {
    const tbody = document.getElementById('tabla-inventario-admin-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    lista.forEach(j => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${j.nombre}</td>
            <td><input type="number" min="0" step="0.01" id="precio-${j.id_juego}" value="${j.precio}"></td>
            <td><input type="number" min="0" step="1" id="stock-${j.id_juego}" value="${j.stock_local}"></td>
            <td>${j.stock_global}</td>
            <td><button type="button" onclick="actualizarJuego(${j.id_juego})">Guardar</button></td>
        `;
        tbody.appendChild(fila);
    });
}

window.filtrarJuegos = () => {
    const texto = document.getElementById('input-buscar').value.toLowerCase();
    const plat = document.getElementById('filtro-plataforma').value;

    const filtrados = juegosData.filter(j => {
        const coincideNombre = j.nombre.toLowerCase().includes(texto);
        const coincidePlat = plat === "" || j.plataforma === plat; 
        return coincideNombre && coincidePlat;
    });

    renderizarTabla(filtrados);
};

window.actualizarJuego = async (id) => {
    const token = localStorage.getItem('access_token');
    const precioInput = document.getElementById(`precio-${id}`);
    const stockInput = document.getElementById(`stock-${id}`);

    if (!precioInput || !stockInput) {
        mostrarNotificacion("No se encontraron los campos del juego para actualizar.", "error");
        return;
    }

    const precio = Number(precioInput.value);
    const stock_local = Number(stockInput.value);

    if (Number.isNaN(precio) || precio < 0) {
        mostrarNotificacion("El precio debe ser un número válido y no negativo.", "error");
        return;
    }

    if (Number.isNaN(stock_local) || stock_local < 0) {
        mostrarNotificacion("El stock local debe ser un número válido y no negativo.", "error");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8000/juegos/${id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ precio, stock_local })
        });

        if (response.ok) {
            mostrarNotificacion("¡Actualizado con éxito!", "success");
            await cargarInventarioAdmin();
        } else {
            const error = await response.json();
            mostrarNotificacion(`Error: ${error.detail || "No se pudo actualizar"}`, "error");
        }
    } catch (err) {
        console.error(err);
        mostrarNotificacion("Error de conexión con el servidor", "error");
    }
};