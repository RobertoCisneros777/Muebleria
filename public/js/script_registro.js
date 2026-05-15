document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const mensajeError = document.getElementById('mensajeError');
    const mensajeExito = document.getElementById('mensajeExito');

    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensajeError.style.display = 'none';
            mensajeExito.style.display = 'none';

            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('../backend/auth/registro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, apellido, email, password })
                });

                const result = await response.json();

                if (result.success) {
                    mensajeExito.textContent = 'Registro exitoso. Redirigiendo al inicio de sesión...';
                    mensajeExito.style.display = 'block';
                    registroForm.reset();
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    mensajeError.textContent = result.message || 'Error al registrar el usuario.';
                    mensajeError.style.display = 'block';
                }
            } catch (error) {
                console.error('Error:', error);
                mensajeError.textContent = 'Error de conexión con el servidor.';
                mensajeError.style.display = 'block';
            }
        });
    }
});
