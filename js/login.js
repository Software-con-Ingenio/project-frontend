// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');
    const seccionLogin = document.getElementById('seccion-login');

    // Si ya existe el token, ocultamos el formulario de login de una vez
    if (token && seccionLogin) {
        seccionLogin.style.display = 'none';
        console.log("Sesión activa detectada, login oculto.");
    }
});

document.getElementById('btn-login').addEventListener('click', async () => {

    if (localStorage.getItem('access_token')) {
        // Cambiado por notificación de advertencia/error
        mostrarNotificacion("Ya tienes una sesión activa. Por favor, cierra sesión para entrar con otra cuenta.", "warning");
        return; // Detiene el código aquí y no intenta hacer el login
    }

    // Asegúrate de que los IDs aquí coincidan con los de tu login.html
    const email = document.getElementById('username').value; 
    const pass = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                contrasena: pass
            })
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        
        console.log("Datos recibidos del servidor:", data); 

        // 1. Guardamos el token
        localStorage.setItem('access_token', data.access_token);
        
        // 2. Intentamos guardar el rol. 
        const rol = data.id_rol || data.rol; 
        
        if (rol) {
            localStorage.setItem('id_rol', rol.toString());
            console.log("Rol guardado exitosamente:", rol);
        } else {
            console.warn("Advertencia: El backend no envió información de rol.");
        }

        // Cambiado por notificación de éxito con temporizador para dar tiempo a verla
        mostrarNotificacion("¡Login exitoso! Redirigiendo...", "success");
        
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1500);

    } catch (error) {
        // Cambiado por notificación de error
        mostrarNotificacion(error.message, "error");
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    // 1. Borramos los datos del navegador
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_rol'); 
    
    // Cambiado por notificación de info con temporizador antes de recargar
    mostrarNotificacion("Has cerrado sesión correctamente.", "info");
    
    setTimeout(() => {
        window.location.reload(); // Recarga la página para volver al estado inicial
    }, 1500);
});