// Variable global para mantener los datos y filtrar sobre ellos
let juegosData = []; 

export async function cargarInventarioAdmin() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");

    if (!esAdmin) return;
    
    try {
        const response = await fetch('http://localhost:8000/juegos');
        juegosData = await response.json(); // Guardamos los datos recibidos
        renderizarTabla(juegosData);        // Dibujamos la tabla inicial
    } catch (e) { console.error("Error cargando inventario", e); }
}

// Función que dibuja la tabla según la lista que reciba
function renderizarTabla(lista) {
    const tbody = document.getElementById('tabla-inventario-admin-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    lista.forEach(j => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${j.nombre}</td>
            <td><input type="number" value="${j.precio}" onchange="actualizarPrecio(${j.id_juego}, this.value)"></td>
            <td><input type="number" value="${j.stock_local}" onchange="actualizarStock(${j.id_juego}, this.value)"></td>
            <td>${j.stock_global || 0}</td>
            <td>${j.es_historico ? 'Sí' : 'No'}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Lógica de Filtros (RF_10 y RF_11)
window.filtrarJuegos = () => {
    const texto = document.getElementById('input-buscar').value.toLowerCase();
    const plat = document.getElementById('filtro-plataforma').value;

    const filtrados = juegosData.filter(j => {
        const coincideNombre = j.nombre.toLowerCase().includes(texto);
        // Ajusta 'j.plataforma' según el nombre real del campo en tu JSON
        const coincidePlat = plat === "" || j.plataforma === plat; 
        return coincideNombre && coincidePlat;
    });

    renderizarTabla(filtrados);
};

// Función global para actualizar Stock (mantén tu lógica actual)
window.actualizarStock = async (id, cantidad) => {
    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:8000/juegos/${id}/stock?nueva_cantidad=${cantidad}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("Stock actualizado");
};

// Función global para actualizar Precio (añadida para mayor control)
window.actualizarPrecio = async (id, nuevoPrecio) => {
    const token = localStorage.getItem('access_token');
    await fetch(`http://localhost:8000/juegos/${id}/precio?nuevo_precio=${nuevoPrecio}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("Precio actualizado");
};
