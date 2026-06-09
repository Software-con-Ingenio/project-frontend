import { verificarSesion, controlarVisibilidadBotones } from './auth.js';
import { cargarJuegos, guardarJuego, cargarOpcionesFormulario} from './juegos.js';
import { guardarUsuario, cargarUsuarios, guardarEdicion} from './usuarios.js'; // <-- Importamos
import { cargarGenres, crearGenero } from './generos.js';
import { crearPlatform, cargarPlatforms} from './platforms.js?v=7.1';
import { descargarReporte } from './reportes.js';
import { cargarInventarioAdmin } from './inventario_admin.js';
import { cargarInventarioVendedor } from './inventario_vendedor.js';
import { inicializarVentas } from './ventas.js';
import { historialManager } from './historial_ventas.js';

document.addEventListener('DOMContentLoaded', async () => {
    verificarSesion();
    controlarVisibilidadBotones();
    cargarJuegos();
    cargarUsuarios();
    cargarGenres();
    cargarPlatforms();
    cargarInventarioAdmin();
    cargarInventarioVendedor();
    inicializarVentas();
    cargarOpcionesFormulario();
    // Si estás en la página de administración
    const contenedor = document.getElementById('historial-container');
    const seccionHistorial = document.getElementById('seccion-historial');
    
    // Si el contenedor existe en esta página...
    if (contenedor) {
        const token = localStorage.getItem('access_token');
        const idRol = localStorage.getItem('id_rol');
        const esAdmin = (token && idRol === "1");

        if (!esAdmin) {
            if (seccionHistorial) seccionHistorial.style.display = 'none';
            if (contenedor) {
                contenedor.innerHTML = "";
                contenedor.style.display = 'none';
            }
        } else {
            // Aseguramos que la sección y el contenedor estén visibles para administradores
            if (seccionHistorial) seccionHistorial.style.display = '';
            if (contenedor) contenedor.style.display = '';
            try {
                const ventas = await historialManager.obtenerVentas();
                console.log("Ventas recibidas:", ventas); // <-- MIRA LA CONSOLA PARA VER SI LLEGAN DATOS
                historialManager.renderizarHistorial(ventas);
            } catch (error) {
                contenedor.innerHTML = "Error al conectar con el servidor.";
                console.error(error);
            }
        }
    }






    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', window.filtrarJuegos);
    }

    const selectPlataforma = document.getElementById('filtro-plataforma');
    if (selectPlataforma) {
        selectPlataforma.addEventListener('change', window.filtrarJuegos);
    }
        
    const inputBuscarV = document.getElementById('input-buscar-vendedor');
    if (inputBuscarV) {
        inputBuscarV.addEventListener('input', window.filtrarJuegosVendedor);
    }

    const selectPlataformaV = document.getElementById('filtro-plataforma-vendedor');
    if (selectPlataformaV) {
        selectPlataformaV.addEventListener('change', window.filtrarJuegosVendedor);
    }
    

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