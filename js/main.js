import { obtenerDatos } from './api.js';

// 1. Función para cargar los juegos (para que veas que ya están en la BD)
async function cargarJuegos() {
    const contenedor = document.getElementById('tabla-juegos');
    if (!contenedor) return; // Si no hay tabla en el HTML, no hacemos nada

    const juegos = await obtenerDatos('juegos');
    contenedor.innerHTML = ""; 
    
    juegos.forEach(juego => {
        const fila = `<tr>
            <td>${juego.id_juego}</td>
            <td>${juego.nombre}</td>
        </tr>`;
        contenedor.innerHTML += fila;
    });
}

// 2. Función para guardar un nuevo juego
async function guardarJuego(event) {
    event.preventDefault(); // Evita que la página se recargue por defecto

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

    // Recuperamos el token guardado en el localStorage por el login
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://localhost:8000/juegos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("¡Juego guardado con éxito!");
            location.reload(); 
        } else {
            const error = await response.json();
            console.error("Error del servidor:", error);
            alert("Error al guardar: " + (error.detail || "Revisa los datos"));
        }
    } catch (err) {
        console.error("Error de conexión:", err);
        alert("No se pudo conectar con el servidor");
    }
}

function verificarSesion() {
    const token = localStorage.getItem('access_token');
    // Si guardaste el rol en el login, debería estar aquí. 
    // Si no, vamos a intentar ver si al menos el usuario está logueado
    const idRol = localStorage.getItem('id_rol'); 
    const seccionJuegos = document.getElementById('seccion-juegos');

    // DEBUG para ver qué recibimos realmente
    console.log("Rol guardado en local:", idRol);

    if (!seccionJuegos) return;

    // ACEPTAMOS: Si idRol es "1" O si es "Administrador"
    if (token && (idRol === "1" || idRol === "Administrador")) {
        seccionJuegos.style.display = 'block';
    } else {
        seccionJuegos.style.display = 'none';
    }
}

function controlarVisibilidadBotones() {
    const token = localStorage.getItem('access_token');
    const seccionLogin = document.getElementById('seccion-login');
    const seccionLogout = document.getElementById('seccion-logout');

    if (token) {
        // Usuario logueado: ocultamos login, mostramos logout
        if (seccionLogin) seccionLogin.style.display = 'none';
        if (seccionLogout) seccionLogout.style.display = 'block';
    } else {
        // Usuario no logueado: mostramos login, ocultamos logout
        if (seccionLogin) seccionLogin.style.display = 'block';
        if (seccionLogout) seccionLogout.style.display = 'none';
    }
}

// Asegúrate de llamarla en el DOMContentLoaded que ya tienes
document.addEventListener('DOMContentLoaded', () => {
    cargarJuegos();
    verificarSesion(); // <--- IMPORTANTE: Esto hace la magia al abrir la página
    controlarVisibilidadBotones(); // <--- Esto controla qué botones se ven según el estado de sesión
    const btnGuardar = document.getElementById('btn-guardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', guardarJuego);
    }
});
