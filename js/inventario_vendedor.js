// Variable global exclusiva para el vendedor
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
                <input type="number" value="${j.stock_local}" 
                       onchange="actualizarStockV(${j.id_juego}, this.value)">
            </td>
            <td>${j.stock_global || 0}</td>
            <td>${j.es_historico ? 'Sí' : 'No'}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Filtro exclusivo para el vendedor (RF_10 y RF_11)
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

// Función de actualización exclusiva para el vendedor
window.actualizarStockV = async (id, cantidad) => {
    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:8000/juegos/${id}/stock?nueva_cantidad=${cantidad}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("Stock actualizado (V)");
};