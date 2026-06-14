export function verificarSesion() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol'); 
    
    // Obtenemos ambas secciones
    const seccionJuegos = document.getElementById('seccion-juegos');
    const seccionUsuarios = document.getElementById('seccion-admin-usuarios');
    const seccionListaUsuarios = document.getElementById('seccion-lista-usuarios');
    const seccionEditar = document.getElementById('seccion-editar-usuario');
    const seccionGenres = document.getElementById('seccion-genres');
    const seccionPlatforms = document.getElementById('seccion-platforms');
    const seccionReportes = document.getElementById('seccion-reportes');
    const seccionVentas = document.getElementById('seccion-ventas');
    const seccionInventarioVendedor = document.getElementById('seccion-inventario-vendedor');
    const seccionInventarioAdmin = document.getElementById('seccion-inventario-admin');

    const seccionHistorial = document.getElementById('seccion-historial'); // Asegúrate de tener este ID en tu HTML
    //ese const lo hace tmbn copitot
    
    const esAdmin = (token && idRol === "1");
    const esVendedor = (token && idRol === "2");

     // Lógica para Inventario Vendedor
     if (seccionInventarioVendedor) {
        seccionInventarioVendedor.style.display = esVendedor ? 'block' : 'none';
    }
    // Lógica para Juegos
    if (seccionJuegos) {
        seccionJuegos.style.display = esAdmin ? 'block' : 'none';
    }

    // Lógica para Usuarios (AQUÍ ESTABA EL FALLO, no existía en tu código)
    if (seccionUsuarios) {
        seccionUsuarios.style.display = esAdmin ? 'block' : 'none';
    }
    if (seccionListaUsuarios) {
        seccionListaUsuarios.style.display = esAdmin ? 'block' : 'none';
    }
    if (seccionEditar) {
        seccionEditar.style.display = 'none'; // Siempre oculto al refrescar
    }

    //eso es lo q copilot hace pa q solo se muestre al admin
    if (seccionGenres) {
        seccionGenres.style.display = esAdmin ? 'block' : 'none';
    }

    if (seccionPlatforms) {
        seccionPlatforms.style.display = esAdmin ? 'block' : 'none';
    }
    if (seccionReportes) {
        seccionReportes.style.display = esAdmin ? 'block' : 'none';
    }
    if (seccionVentas) {
        seccionVentas.style.display = (esAdmin || esVendedor) ? 'block' : 'none';
    }

    if (seccionInventarioAdmin) {
        seccionInventarioAdmin.style.display = esAdmin ? 'block' : 'none';
    }

    if (seccionHistorial) {
        seccionHistorial.style.display = esAdmin ? 'block' : 'none';
    }


}
export function controlarVisibilidadBotones() {
    // ... (esto déjalo igual, está perfecto)
    const token = localStorage.getItem('access_token');
    const seccionLogin = document.getElementById('seccion-login');
    const seccionLogout = document.getElementById('seccion-logout');
    const btnVerPerfil = document.getElementById('btn-ver-perfil');
    const seccionPerfil = document.getElementById('seccion-perfil');

    if (token) {
        if (seccionLogin) seccionLogin.style.display = 'none';
        if (seccionLogout) seccionLogout.style.display = 'block';
        if (btnVerPerfil) btnVerPerfil.style.display = 'inline-block';
    } else {
        if (seccionLogin) seccionLogin.style.display = 'block';
        if (seccionLogout) seccionLogout.style.display = 'none';
        if (btnVerPerfil) btnVerPerfil.style.display = 'none';
        if (seccionPerfil) seccionPerfil.style.display = 'none';
    }
}