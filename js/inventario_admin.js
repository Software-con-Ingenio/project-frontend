export async function cargarInventarioAdmin() {

    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;
    
    try {
        const response = await fetch('http://localhost:8000/juegos');
        const juegos = await response.json();
        const tbody = document.getElementById('tabla-inventario-admin-body');
        tbody.innerHTML = "";

        juegos.forEach(j => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${j.nombre}</td>
                <td>
                    <input type="number" value="${j.precio}" 
                           onchange="actualizarStock(${j.id_juego}, this.value)">
                </td>
                <td>
                    <input type="number" value="${j.stock_local}" 
                           onchange="actualizarStock(${j.id_juego}, this.value)">
                </td>
                <td>${j.stock_global}</td>
                <td>${j.es_historico ? 'Sí' : 'No'}</td>
            `;
            tbody.appendChild(fila);
        });
    } catch (e) { console.error("Error cargando inventario", e); }
}

// Función global para que el onclick del input la encuentre
window.actualizarStock = async (id, cantidad) => {
    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:8000/juegos/${id}/stock?nueva_cantidad=${cantidad}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("Stock actualizado");
};