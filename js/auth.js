export function verificarSesion() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol'); 
    
    // Obtenemos ambas secciones
    const seccionJuegos = document.getElementById('seccion-juegos');
    const seccionUsuarios = document.getElementById('seccion-admin-usuarios');
    const seccionListaUsuarios = document.getElementById('seccion-lista-usuarios');
    const seccionEditar = document.getElementById('seccion-editar-usuario');

    const esAdmin = (token && idRol === "1");

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
}

export function controlarVisibilidadBotones() {
    // ... (esto déjalo igual, está perfecto)
    const token = localStorage.getItem('access_token');
    const seccionLogin = document.getElementById('seccion-login');
    const seccionLogout = document.getElementById('seccion-logout');

    if (token) {
        if (seccionLogin) seccionLogin.style.display = 'none';
        if (seccionLogout) seccionLogout.style.display = 'block';
    } else {
        if (seccionLogin) seccionLogin.style.display = 'block';
        if (seccionLogout) seccionLogout.style.display = 'none';
    }
}