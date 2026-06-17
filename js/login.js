document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');
    const seccionLogin = document.getElementById('seccion-login');

    if (token && seccionLogin) {
        seccionLogin.style.display = 'none';
        console.log("Sesión activa detectada, login oculto.");
    }
});

document.getElementById('btn-login').addEventListener('click', async () => {
    if (localStorage.getItem('access_token')) {
        mostrarNotificacion("Ya tienes una sesión activa. Por favor, cierra sesión para entrar con otra cuenta.", "warning");
        return; 
    }

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

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('nombre_usuario', data.nombre || 'Usuario');
        
        const rol = data.id_rol || data.rol; 
        if (rol) {
            localStorage.setItem('id_rol', rol.toString());
            console.log("Rol guardado exitosamente:", rol);
        } else {
            console.warn("Advertencia: El backend no envió información de rol.");
        }

        mostrarNotificacion("¡Login exitoso! Redirigiendo...", "success");
        
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1500);

    } catch (error) {
        mostrarNotificacion(error.message, "error");
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_rol'); 
    localStorage.removeItem('nombre_usuario');
    
    mostrarNotificacion("Has cerrado sesión correctamente.", "info");
    
    setTimeout(() => {
        window.location.reload(); 
    }, 1500);
});