const { createApp } = Vue;
createApp({
    data() {
        return {
            form: { operacion: '', id_usuario: '', nombre: '', apellido: '', email: '', password: '', rol: 'cliente' },
            // Guarda los datos originales del usuario cargado
            datosOriginales: null,
            alertaVisible: false,
            mensajeAlerta: '',
            alertaClase: 'alert-success',
            cargandoUsuario: false
        }
    },
    watch: {
        'form.operacion': function(newVal) {
            // Limpiar campos al cambiar operación
            this.form.id_usuario = '';
            this.form.nombre = '';
            this.form.apellido = '';
            this.form.email = '';
            this.form.password = '';
            this.form.rol = 'cliente';
            this.datosOriginales = null;
        }
    },
    methods: {
        async buscarUsuario() {
            if (!this.form.id_usuario) {
                this.mostrarAlerta('Ingresa un ID para buscar', 'alert-warning');
                return;
            }

            this.cargandoUsuario = true;

            try {
                const response = await fetch(`../backend/api/get_usuario.php?id=${this.form.id_usuario}`);
                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    this.form.nombre = data.nombre || '';
                    this.form.apellido = data.apellido || '';
                    this.form.email = data.email || '';
                    this.form.rol = data.rol || 'cliente';

                    // Guardar copia de los datos originales
                    this.datosOriginales = { ...data };

                    this.mostrarAlerta(`Usuario "${data.nombre} ${data.apellido}" cargado correctamente`, 'alert-info');
                } else {
                    this.mostrarAlerta(result.message || 'Usuario no encontrado', 'alert-danger');
                    this.datosOriginales = null;
                }
            } catch (error) {
                console.error('Error al buscar usuario:', error);
                this.mostrarAlerta('Error de conexión al buscar el usuario', 'alert-danger');
            } finally {
                this.cargandoUsuario = false;
            }
        },

        async gestionarUsuario() {
            // En Modificación, verificar que se haya cargado un usuario primero
            if (this.form.operacion === 'Modificación' && !this.datosOriginales) {
                this.mostrarAlerta('Primero busca un usuario por ID', 'alert-warning');
                return;
            }

            try {
                const response = await fetch('../backend/api/gestionar_usuarios.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.form)
                });
                const result = await response.json();
                if(result.success) {
                    this.mostrarAlerta(`¡Usuario procesado con éxito!`, 'alert-success');
                    this.form = { operacion: '', id_usuario: '', nombre: '', apellido: '', email: '', password: '', rol: 'cliente' };
                    this.datosOriginales = null;
                } else {
                    this.mostrarAlerta('Error: ' + result.message, 'alert-danger');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error de conexión', 'alert-danger');
            }
        },

        mostrarAlerta(mensaje, clase) {
            this.mensajeAlerta = mensaje;
            this.alertaClase = clase || 'alert-success';
            this.alertaVisible = true;
            // también mostrar la alerta global estilizada
            const tipo = (clase && clase.startsWith('alert-')) ? clase.replace('alert-','') : 'success';
            if (window.mostrarAlertaGlobal) window.mostrarAlertaGlobal(mensaje, tipo);
            setTimeout(() => {
                this.alertaVisible = false;
            }, 3000);
        }
    }
}).mount('#app');
