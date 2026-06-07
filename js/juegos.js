// js/juegos.js
import { obtenerDatos } from './api.js';

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
        id_plataforma: 1, 
        id_genero: 1,     
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
        alert("¡Juego guardado!");
        location.reload();
    } else {
        alert("Error al guardar");
    }
}