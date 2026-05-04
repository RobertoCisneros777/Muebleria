const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                id_mueble: '',
                operacion: '',
                nombre: '',
                categoria: '',
                precio: '',
                descripcion: '',
                imagen_url: ''
            },
            archivoImagen: null,
            errores: {},
            alertaVisible: false,
            mensajeAlerta: '',
            nombreDisponible: true,
            cargandoValidacion: false
        }
    },
    watch: {
        'form.nombre': function(newVal) {
            if (newVal.length >= 4) {
                this.validarNombreAjax(newVal);
            }
        }
    },
    methods: {
        manejarArchivo(event) {
            this.archivoImagen = event.target.files[0];
        },
        async validarNombreAjax(nombre) {
            this.cargandoValidacion = true;
            try {
                const response = await fetch(`php/api/validar_disponibilidad.php?type=producto&value=${encodeURIComponent(nombre)}`);
                const data = await response.json();
                this.nombreDisponible = data.available;
            } catch (error) {
                console.error('Error validando nombre:', error);
            } finally {
                this.cargandoValidacion = false;
            }
        },
        async validarFormulario() {
            this.errores = {};
            this.alertaVisible = false;

            if (!this.form.nombre || this.form.nombre.length < 4) {
                this.errores.nombre = true;
            }
            if (!this.nombreDisponible && this.form.operacion === 'Alta') {
                this.errores.nombreDuplicado = true;
            }
            if (!this.form.precio || parseFloat(this.form.precio) <= 0) {
                this.errores.precio = true;
            }
            if (!this.form.descripcion || this.form.descripcion.length < 10) {
                this.errores.descripcion = true;
            }

            if (Object.keys(this.errores).length === 0) {
                await this.guardarEnBD();
            }
        },
        async guardarEnBD() {
            try {
                const formData = new FormData();
                for (let key in this.form) {
                    formData.append(key, this.form[key]);
                }
                if (this.archivoImagen) {
                    formData.append('imagen', this.archivoImagen);
                }

                const response = await fetch('php/api/gestionar_producto.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                if (result.success) {
                    this.mensajeAlerta = `¡Operación "${this.form.operacion}" realizada con éxito!`;
                    this.alertaVisible = true;
                    this.limpiarFormulario();
                    setTimeout(() => {
                        this.alertaVisible = false;
                    }, 3000);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error al guardar:', error);
            }
        },
        limpiarFormulario() {
            this.form = { id_mueble: '', operacion: '', nombre: '', categoria: '', precio: '', descripcion: '', imagen_url: '' };
            this.archivoImagen = null;
        }
    }
}).mount('#app');