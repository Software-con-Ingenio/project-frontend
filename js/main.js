import { verificarSesion, controlarVisibilidadBotones } from './auth.js';
import { cargarJuegos, guardarJuego } from './juegos.js';
import { guardarUsuario, cargarUsuarios, guardarEdicion} from './usuarios.js'; // <-- Importamos
import { cargarGenres, crearGenero } from './generos.js';
import { crearPlatform, cargarPlatforms} from './platforms.js';
import { descargarReporte } from './reportes.js';


document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    controlarVisibilidadBotones();
    cargarJuegos();
    cargarUsuarios();
    cargarGenres();
    cargarPlatforms();
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

    const btnCrearGenero = document.getElementById('btn-crear-genero');
    if (btnCrearGenero) btnCrearGenero.addEventListener('click', crearGenero);
    
    const btnCrearPlatform = document.getElementById('btn-crear-plataforma');
    if (btnCrearPlatform) btnCrearPlatform.addEventListener('click', crearPlatform);

    document.getElementById('btn-reporte-diario').addEventListener('click', () => {
        const fecha = document.getElementById('fecha-diaria').value;
        if (!fecha) return alert("Selecciona una fecha");
        descargarReporte(`ventas/reporte/pdf/diario/${fecha}`, `reporte_${fecha}.pdf`);
    });

    // Reporte Mensual
    document.getElementById('btn-reporte-mensual').addEventListener('click', () => {
        const anio = document.getElementById('anio-mensual').value;
        const mes = document.getElementById('mes-mensual').value;
        if (!anio || !mes) return alert("Completa año y mes");
        descargarReporte(`ventas/reporte/pdf/mensual/${anio}/${mes}`, `reporte_${anio}_${mes}.pdf`);
    });

    // Reporte Total
    document.getElementById('btn-reporte-total').addEventListener('click', () => {
        descargarReporte('ventas/reporte/pdf/total', 'reporte_historico_total.pdf');
    });
});