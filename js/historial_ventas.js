export const historialManager = {

    
    async obtenerVentas() {
        const response = await fetch('http://localhost:8000/ventas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        return await response.json();
    },

    renderizarHistorial(ventas) {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const esAdmin = (token && idRol === "1");
    const contenedor = document.getElementById('historial-container');
    const seccionHistorial = document.getElementById('seccion-historial');

    if (!esAdmin) {
        if (seccionHistorial) seccionHistorial.style.display = 'none';
        if (contenedor) {
            contenedor.innerHTML = "";
            contenedor.style.display = 'none';
        }
        return;
    }

    // Si es admin, aseguramos que la sección y el contenedor estén visibles
    if (seccionHistorial) seccionHistorial.style.display = '';
    if (contenedor) contenedor.style.display = '';

    // Usamos .map para construir las filas dinámicamente
    const filas = ventas.map(v => {
        // Mapeamos los detalles a una lista legible
        const listaJuegos = v.detalles.map(d => 
            `${d.nombre_juego} (x${d.cantidad})`
        ).join(', ');

        return `
            <tr>
                <td>${v.id_venta}</td>
                <td>${v.usuario}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha.substring(0, 16)}</td>
                <td>${listaJuegos}</td>
            </tr>
        `;
    }).join('');

    contenedor.innerHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>ID Venta</th>
                    <th>Vendedor</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Juegos Vendidos</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
    }
};