window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerText = mensaje;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 400);
    }, 3500);
};

window.mostrarConfirmacion = function(mensaje, accionConfirmada) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    overlay.innerHTML = `
        <div class="confirm-box">
            <p>${mensaje}</p>
            <div class="confirm-botones">
                <button id="confirm-btn-si" class="btn-confirm-si">Sí, eliminar</button>
                <button id="confirm-btn-no" class="btn-confirm-no">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('#confirm-btn-no').onclick = () => overlay.remove();
    
    overlay.querySelector('#confirm-btn-si').onclick = () => {
        accionConfirmada();
        overlay.remove();
    };
};

import { verificarSesion, controlarVisibilidadBotones } from './auth.js';
import { cargarJuegos, guardarJuego, cargarOpcionesFormulario} from './juegos.js';
import { guardarUsuario, cargarUsuarios, guardarEdicion} from './usuarios.js';
import { cargarGenres, crearGenero } from './generos.js';
import { crearPlatform, cargarPlatforms } from './platforms.js';
import { descargarReporte } from './reportes.js';
import { cargarInventarioAdmin } from './inventario_admin.js';
import { cargarInventarioVendedor } from './inventario_vendedor.js';
import { inicializarVentas } from './ventas.js';
import { historialManager } from './historial_ventas.js';
import { cargarPerfil } from './perfil.js';

document.addEventListener('DOMContentLoaded', async () => {
    const btnTema = document.getElementById('btn-tema');
    const temaGuardado = localStorage.getItem('tema');
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const temaActual = temaGuardado || preferenciaSistema;
    
    if (temaActual === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('tema', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('tema', 'light');
            }
        });
    }

    try { verificarSesion(); } catch(e) { console.error(e); }
    try { controlarVisibilidadBotones(); } catch(e) { console.error(e); }
    try { cargarJuegos(); } catch(e) { console.error(e); }
    try { await cargarUsuarios(); } catch(e) { console.error(e); }
    try { await cargarGenres(); } catch(e) { console.error(e); }
    try { await cargarPlatforms(); } catch(e) { console.error(e); }
    try { cargarInventarioAdmin(); } catch(e) { console.error(e); }
    try { cargarInventarioVendedor(); } catch(e) { console.error(e); }
    try { inicializarVentas(); } catch(e) { console.error(e); }
    try { cargarOpcionesFormulario(); } catch(e) { console.error(e); }

    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol');
    const nombreUsuario = localStorage.getItem('nombre_usuario') || 'Usuario';
    const seccionLogout = document.getElementById('seccion-logout');
    const textoNombre = document.getElementById('usuario-nombre-sesion');

    if (token) {
        if (seccionLogout) seccionLogout.style.display = 'flex';
        if (textoNombre) textoNombre.innerText = nombreUsuario;

        const btnNavJuegos = document.getElementById('btn-nav-juegos');
        const btnNavUsuarios = document.getElementById('btn-nav-usuarios');

        if (idRol === "2") {
            if (btnNavJuegos) btnNavJuegos.style.display = 'none';
            if (btnNavUsuarios) btnNavUsuarios.style.display = 'none';
        } else {
            if (btnNavJuegos) btnNavJuegos.style.display = '';
            if (btnNavUsuarios) btnNavUsuarios.style.display = '';
        }
    } else {
        if (seccionLogout) seccionLogout.style.display = 'none';
    }

    const contenedor = document.getElementById('historial-container');
    const seccionHistorial = document.getElementById('seccion-historial');
    
    if (contenedor) {
        const esAdmin = (token && idRol === "1");

        if (!esAdmin) {
            if (seccionHistorial) seccionHistorial.style.display = 'none';
            if (contenedor) contenedor.style.display = 'none';
        } else {
            if (seccionHistorial) seccionHistorial.style.display = '';
            if (contenedor) contenedor.style.display = '';
            try {
                const ventas = await historialManager.obtenerVentas();
                historialManager.renderizarHistorial(ventas);
            } catch (error) {
                if (contenedor) contenedor.innerHTML = "Error al conectar con el servidor.";
                console.error(error);
            }
        }
    }

    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) inputBuscar.addEventListener('input', window.filtrarJuegos);

    const selectPlataforma = document.getElementById('filtro-plataforma');
    if (selectPlataforma) selectPlataforma.addEventListener('change', window.filtrarJuegos);
        
    const inputBuscarV = document.getElementById('input-buscar-vendedor');
    if (inputBuscarV) inputBuscarV.addEventListener('input', window.filtrarJuegosVendedor);

    const selectPlataformaV = document.getElementById('filtro-plataforma-vendedor');
    if (selectPlataformaV) selectPlataformaV.addEventListener('change', window.filtrarJuegosVendedor);
    
    const btnGuardarJuego = document.getElementById('btn-guardar');
    if (btnGuardarJuego) btnGuardarJuego.addEventListener('click', guardarJuego);

    const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
    if (btnGuardarUsuario) btnGuardarUsuario.addEventListener('click', guardarUsuario);

    const btnGuardarEdicion = document.getElementById('btn-guardar-edicion');
    if (btnGuardarEdicion) btnGuardarEdicion.addEventListener('click', guardarEdicion);

    const btnCrearGenero = document.getElementById('btn-crear-genero');
    if (btnCrearGenero) btnCrearGenero.addEventListener('click', crearGenero);

    const btnCrearPlatform = document.getElementById('btn-crear-plataforma');
    if (btnCrearPlatform) btnCrearPlatform.addEventListener('click', crearPlatform);
});