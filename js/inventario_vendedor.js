// Variable global para el vendedor
let juegosDataVendedor = [];

export async function cargarInventarioVendedor() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esVendedor = (token && idRol === "2");

    if (!esVendedor) return;

    try {
        const response = await fetch('http://localhost:8000/juegos');
        juegosDataVendedor = await response.json();
        renderizarTablaVendedor(juegosDataVendedor);
    } catch (e) { console.error("Error cargando inventario vendedor", e); }
}

function renderizarTablaVendedor(lista) {
    const tbody = document.getElementById('tabla-inventario-vendedor-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    lista.forEach(j => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${j.nombre}</td>
            <td>$${j.precio}</td>
            <td>
                <input type="number" min="0" value="${j.stock_local}" 
                       id="stock-v-${j.id_juego}">
            </td>
            <td>${j.stock_global || 0}</td>
            <td><button type="button" onclick="actualizarStockV(${j.id_juego})">Guardar</button></td>
        `;
        tbody.appendChild(fila);
    });
}

// Filtro exclusivo para el vendedor
window.filtrarJuegosVendedor = () => {
    const texto = document.getElementById('input-buscar-vendedor').value.toLowerCase();
    const plat = document.getElementById('filtro-plataforma-vendedor').value;

    const filtrados = juegosDataVendedor.filter(j => {
        const coincideNombre = j.nombre.toLowerCase().includes(texto);
        const coincidePlat = plat === "" || j.plataforma === plat;
        return coincideNombre && coincidePlat;
    });

    renderizarTablaVendedor(filtrados);
};

// Función de actualización unificada para el vendedor
window.actualizarStockV = async (id) => {
    const token = localStorage.getItem('access_token');
    const stockInput = document.getElementById(`stock-v-${id}`);
    const stock_local = Number(stockInput.value);

    if (Number.isNaN(stock_local) || stock_local < 0) {
        alert('El stock debe ser un número válido y no negativo.');
        return;
    }

    // Usamos el mismo endpoint unificado que el admin
    const response = await fetch(`http://localhost:8000/juegos/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ stock_local }) // Solo enviamos el stock
    });

    if (response.ok) {
        alert("Stock actualizado correctamente");
        await cargarInventarioVendedor(); // Recargamos datos
    } else {
        const error = await response.json();
        alert("Error: " + (error.detail || "No se pudo actualizar"));
    }
};