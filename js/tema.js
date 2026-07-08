document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema');
    const temaGuardado = localStorage.getItem('tema');
    
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const temaActual = temaGuardado || preferenciaSistema;
    document.documentElement.setAttribute('data-theme', temaActual);
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            let nuevoTema = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nuevoTema);
            localStorage.setItem('tema', nuevoTema);
        });
    }
});