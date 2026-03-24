const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                operacion: '',
                nombre: '',
                categoria: '',
                precio: '',
                descripcion: ''
            },
            errores: {},
            exito: false
        }
    },
    methods: {
        validarFormulario() {
            this.errores = {};
            this.exito = false;

            if (!this.form.nombre) {
                this.errores.nombre = true;
            }

            if (!this.form.precio || this.form.precio <= 0) {
                this.errores.precio = true;
            }

            if (!this.form.descripcion) {
                this.errores.descripcion = true;
            }

            if (Object.keys(this.errores).length === 0) {
                this.exito = true;
            }
        }
    }
}).mount('#app');