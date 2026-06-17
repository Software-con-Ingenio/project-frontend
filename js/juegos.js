// js/juegos.js
import { obtenerDatos } from './api.js';

export async function cargarOpcionesFormulario() {
    const token = localStorage.getItem('access_token');
    
    // Cargar plataformas
    const resP = await fetch('http://localhost:8000/platforms', { headers: { 'Authorization': `Bearer ${token}` } });
    const platforms = await resP.json();
    const selP = document.getElementById('select-plataforma');
    selP.innerHTML = platforms.map(p => `<option value="${p.id_plataforma}">${p.nombre_plataforma}</option>`).join('');

    // Cargar géneros
    const resG = await fetch('http://localhost:8000/genres', { headers: { 'Authorization': `Bearer ${token}` } });
    const genres = await resG.json();
    const selG = document.getElementById('select-genero');
    selG.innerHTML = genres.map(g => `<option value="${g.id_genero}">${g.nombre_genero}</option>`).join('');
}


export async function cargarJuegos() {
    const contenedor = document.getElementById('tabla-juegos');
    if (!contenedor) return;

    const juegos = await obtenerDatos('juegos');
    contenedor.innerHTML = juegos.map(juego => `
        <tr>
            <td>${juego.id_juego}</td>
            <td>${juego.nombre}</td>
        </tr>
    `).join('');
}

export async function guardarJuego(event) {
    event.preventDefault();
    const token = localStorage.getItem('access_token');
    
    const data = {
        nombre: document.getElementById('input-nombre').value,
        id_plataforma: parseInt(document.getElementById('select-plataforma').value),
        id_genero: parseInt(document.getElementById('select-genero').value),
        precio: parseFloat(document.getElementById('input-precio').value || 0),
        stock_local: parseInt(document.getElementById('input-stock').value || 0),
        stock_global: parseInt(document.getElementById('input-stock-global').value || 0),
        es_historico: false,
        imagen: "default.jpg"
    };

    const response = await fetch('http://localhost:8000/juegos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        mostrarNotificacion("Agregado con éxito!", "success");
        setTimeout(() => { location.reload(); }, 1500);
    } else {
        const error = await response.json();
        mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
    }
}