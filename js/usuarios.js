// js/usuarios.js

export async function guardarUsuario(event) {
    if (event) event.preventDefault();

    const data = {
        nombre: document.getElementById('input-nombre-usuario').value,
        email: document.getElementById('input-email-usuario').value,
        contrasena: document.getElementById('input-pass-usuario').value,
        id_rol: parseInt(document.getElementById('input-rol').value),
        activo: true // Por defecto
    };

    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://localhost:8000/usuarios', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            mostrarNotificacion("¡Usuario creado con éxito!", "success");
            setTimeout(() => { location.reload(); }, 1500);
        } else {
            const error = await response.json();
            mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
        }
    } catch (err) {
        console.error("Error de conexión:", err);
        mostrarNotificacion("Error de conexión con el servidor", "error");
    }
}

// 1. Cargar lista de usuarios
export async function cargarUsuarios() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol'); 
    const esAdmin = (token && idRol === "1"); 

    if (!esAdmin) {
        return;
    }

    const thAcciones = document.getElementById('th-acciones'); 
    if (thAcciones) {
        thAcciones.style.display = esAdmin ? '' : 'none';
    }
    
    try {
        const response = await fetch('http://localhost:8000/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Error al cargar usuarios");
        
        const usuarios = await response.json();
        const tbody = document.getElementById('tabla-usuarios-body');
        if (tbody) tbody.innerHTML = ""; 

        usuarios.forEach(u => {
            const fila = document.createElement('tr');
            let htmlFila = `<td>${u.nombre}</td><td>${u.email}</td>`;
            
            if (esAdmin) {
                htmlFila += `<td>
                    <button class="btn-editar">Editar</button> 
                    <button class="btn-eliminar">Eliminar</button>
                </td>`;
            } else {
                htmlFila += `<td>-</td>`; 
            }
            
            fila.innerHTML = htmlFila;

            if (esAdmin) {
                fila.querySelector('.btn-editar').onclick = () => abrirEdicion(u);
                fila.querySelector('.btn-eliminar').onclick = () => eliminarUsuario(u.id_usuario);
            }
            
            if (tbody) tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

// Al hacer clic en "Editar" en la tabla
export function abrirEdicion(u) {
    const seccion = document.getElementById('seccion-editar-usuario');
    if (seccion) seccion.style.display = 'block';
    
    document.getElementById('edit-id').value = u.id_usuario;
    document.getElementById('edit-nombre').value = u.nombre;
    document.getElementById('edit-email').value = u.email;
    document.getElementById('edit-rol').value = u.id_rol;
    document.getElementById('edit-activo').value = u.activo.toString();
}

// Enviar los cambios
export async function guardarEdicion() {
    const id = document.getElementById('edit-id').value;
    
    const datos = {
        nombre: document.getElementById('edit-nombre').value,
        email: document.getElementById('edit-email').value,
        id_rol: Number(document.getElementById('edit-rol').value),
        activo: document.getElementById('edit-activo').value === "true"
    };

    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            mostrarNotificacion("¡Usuario Actualizado!", "success");
            setTimeout(() => { location.reload(); }, 1500);
        } else {
            const error = await response.json();
            mostrarNotificacion(`Error: ${error.detail || "Datos incorrectos"}`, "error");
        }
    } catch (err) {
        console.error(err);
        mostrarNotificacion("Error al conectar con el servidor", "error");
    }
}

// Eliminar Usuario
export async function eliminarUsuario(id) {
    mostrarConfirmacion("¿Seguro que quieres eliminar este usuario?", async () => {
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                mostrarNotificacion("¡Eliminado con éxito!", "success");
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                const error = await response.json();
                mostrarNotificacion(`Error: ${error.detail || "Error al eliminar"}`, "error");
            }
        } catch (err) {
            console.error(err);
            mostrarNotificacion("Error al conectar con el servidor", "error");
        }
    });
}