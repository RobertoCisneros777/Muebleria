const { createApp } = Vue;
createApp({
    data() {
        return {
            form: { operacion: '', id_usuario: '', nombre: '', apellido: '', email: '', password: '', rol: 'cliente' },
            alertaVisible: false,
            mensajeAlerta: ''
        }
    },
    methods: {
        async gestionarUsuario() {
            try {
                const response = await fetch('php/api/gestionar_usuarios.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.form)
                });
                const result = await response.json();
                if(result.success) {
                    this.mensajeAlerta = `¡Usuario procesado con éxito!`;
                    this.alertaVisible = true;
                    this.form = { operacion: '', id_usuario: '', nombre: '', apellido: '', email: '', password: '', rol: 'cliente' };
                    setTimeout(() => {
                        this.alertaVisible = false;
                    }, 3000);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}).mount('#app');
