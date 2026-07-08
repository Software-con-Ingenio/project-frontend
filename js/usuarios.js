// js/usuarios.js
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
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Usuario creado con éxito");
            location.reload(); 
        } else {
            const error = await response.json();
            alert("Error: " + (error.detail || "No se pudo crear el usuario"));
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error de conexión con el servidor");
    }
}
// js/usuarios.js

// 1. Cargar lista de usuarios
// js/usuarios.js
// js/usuarios.js

export async function cargarUsuarios() {
    const token = localStorage.getItem('access_token');
    const idRol = localStorage.getItem('id_rol'); // Obtenemos el rol aquí
    const esAdmin = (token && idRol === "1"); // Misma lógica que en auth.js

    if (!esAdmin) {
        return;
    }

    const thAcciones = document.getElementById('th-acciones'); // Asegúrate de tener este ID en tu <th>
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
        tbody.innerHTML = ""; 

        usuarios.forEach(u => {
            const fila = document.createElement('tr');
            
            // Creamos el HTML básico
            let htmlFila = `<td>${u.nombre}</td><td>${u.email}</td>`;
            
            // SOLO agregamos la columna de acciones si es admin
            if (esAdmin) {
                htmlFila += `<td>
                    <button class="btn-editar">Editar</button> 
                    <button class="btn-eliminar">Eliminar</button>
                </td>`;
            } else {
                htmlFila += `<td>-</td>`; // Celda vacía para usuarios normales
            }
            
            fila.innerHTML = htmlFila;

            // Agregamos eventos solo si existen los botones
            if (esAdmin) {
                fila.querySelector('.btn-editar').onclick = () => abrirEdicion(u);
                fila.querySelector('.btn-eliminar').onclick = () => eliminarUsuario(u.id_usuario);
            }
            
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
    }
}





/////////////


// js/usuarios.js

// Al hacer clic en "Editar" en la tabla
export function abrirEdicion(u) {
    document.getElementById('seccion-editar-usuario').style.display = 'block';
    
    // Inyectar valores
    document.getElementById('edit-id').value = u.id_usuario;
    document.getElementById('edit-nombre').value = u.nombre;
    document.getElementById('edit-email').value = u.email;
    document.getElementById('edit-rol').value = u.id_rol;
    document.getElementById('edit-activo').value = u.activo.toString();
}

// Enviar los cambios
// js/usuarios.js

export async function guardarEdicion() {
    const id = document.getElementById('edit-id').value;
    
    // Enviamos los campos editables del usuario
    const datos = {
        nombre: document.getElementById('edit-nombre').value,
        email: document.getElementById('edit-email').value,
        id_rol: Number(document.getElementById('edit-rol').value),
        activo: document.getElementById('edit-activo').value === "true"
    };

    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        alert("Usuario actualizado correctamente");
        location.reload();
    } else {
        const error = await response.json();
        alert("Error: " + (error.detail || "Error desconocido"));
    }
}

export async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert("Eliminado");
        location.reload();
    } else {
        alert("Error al eliminar");
    }
}