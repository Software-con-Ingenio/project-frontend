// js/main.js
import { verificarSesion, controlarVisibilidadBotones } from './auth.js';
import { cargarJuegos, guardarJuego } from './juegos.js';
import { guardarUsuario, cargarUsuarios, guardarEdicion} from './usuarios.js'; // <-- Importamos

document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    controlarVisibilidadBotones();
    cargarJuegos();
    cargarUsuarios();
    
    // Eventos
    const btnGuardarJuego = document.getElementById('btn-guardar');
    if (btnGuardarJuego) btnGuardarJuego.addEventListener('click', guardarJuego);

    // Nuevo Evento para usuarios
    const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
    if (btnGuardarUsuario) btnGuardarUsuario.addEventListener('click', guardarUsuario);

    const btnGuardarEdicion = document.getElementById('btn-guardar-edicion');
    if (btnGuardarEdicion) {
        btnGuardarEdicion.addEventListener('click', guardarEdicion);
    }
});