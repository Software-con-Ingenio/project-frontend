export async function cargarPerfil() {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:8000/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
        const data = await response.json();
        // Rellenamos el HTML
        document.getElementById('perfil-nombre').textContent = data.nombre;
        document.getElementById('perfil-email').textContent = data.email;
        document.getElementById('perfil-rol').textContent = data.rol;
        document.getElementById('perfil-ventas').textContent = data.total_ventas;
        
        // Hacemos visible la sección
        document.getElementById('seccion-perfil').style.display = 'block';
    } else {
        console.error("Error al cargar perfil");
    }
}