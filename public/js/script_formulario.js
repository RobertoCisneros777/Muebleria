const { createApp } = Vue;

createApp({
    template: '#app-template',
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
            // Guarda los datos originales del producto cargado para comparar
            datosOriginales: null,
            archivoImagen: null,
            errores: {},
            alertaVisible: false,
            mensajeAlerta: '',
            alertaClase: 'alert-success',
            nombreDisponible: true,
            cargandoValidacion: false,
            cargandoProducto: false
        }
    },
    watch: {
        'form.nombre': function(newVal) {
            if (newVal.length >= 4 && this.form.operacion === 'Alta') {
                this.validarNombreAjax(newVal);
            }
            // En modificación, solo validar si el nombre cambió respecto al original
            if (this.form.operacion === 'Modificación' && this.datosOriginales) {
                if (newVal !== this.datosOriginales.nombre && newVal.length >= 4) {
                    this.validarNombreAjax(newVal);
                } else if (newVal === this.datosOriginales.nombre) {
                    this.nombreDisponible = true;
                }
            }
        },
        'form.operacion': function(newVal) {
            // Al cambiar de operación, limpiar los campos (excepto operación)
            this.form.id_mueble = '';
            this.form.nombre = '';
            this.form.categoria = '';
            this.form.precio = '';
            this.form.descripcion = '';
            this.form.imagen_url = '';
            this.datosOriginales = null;
            this.archivoImagen = null;
            this.errores = {};
            this.nombreDisponible = true;
        }
    },
    methods: {
        manejarArchivo(event) {
            this.archivoImagen = event.target.files[0];
        },

        async buscarProducto() {
            if (!this.form.id_mueble) {
                this.mostrarAlerta('Ingresa un ID para buscar', 'alert-warning');
                return;
            }

            this.cargandoProducto = true;
            this.errores = {};

            try {
                const response = await fetch(`../backend/api/get_producto.php?id=${this.form.id_mueble}`);
                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    this.form.nombre = data.nombre || '';
                    this.form.categoria = data.categoria || '';
                    this.form.precio = data.precio || '';
                    this.form.descripcion = data.descripcion || '';
                    this.form.imagen_url = data.imagen_url || '';

                    // Guardar copia de los datos originales
                    this.datosOriginales = { ...data };
                    this.nombreDisponible = true;

                    this.mostrarAlerta(`Producto "${data.nombre}" cargado correctamente`, 'alert-info');
                } else {
                    this.mostrarAlerta(result.message || 'Producto no encontrado', 'alert-danger');
                    this.datosOriginales = null;
                }
            } catch (error) {
                console.error('Error al buscar producto:', error);
                this.mostrarAlerta('Error de conexión al buscar el producto', 'alert-danger');
            } finally {
                this.cargandoProducto = false;
            }
        },

        async validarNombreAjax(nombre) {
            this.cargandoValidacion = true;
            try {
                const response = await fetch(`../backend/api/validar_disponibilidad.php?type=producto&value=${encodeURIComponent(nombre)}`);
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

            // En Modificación, verificar que se haya cargado un producto primero
            if (this.form.operacion === 'Modificación' && !this.datosOriginales) {
                this.mostrarAlerta('Primero busca un producto por ID', 'alert-warning');
                return;
            }

            if (this.form.operacion !== 'Eliminación') {
                if (!this.form.nombre || this.form.nombre.length < 4) {
                    this.errores.nombre = true;
                }
                if (!this.nombreDisponible && this.form.operacion === 'Alta') {
                    this.errores.nombreDuplicado = true;
                }
                // En modificación, solo marcar duplicado si el nombre cambió y no está disponible
                if (this.form.operacion === 'Modificación' && this.datosOriginales && 
                    this.form.nombre !== this.datosOriginales.nombre && !this.nombreDisponible) {
                    this.errores.nombreDuplicado = true;
                }
                if (!this.form.precio || parseFloat(this.form.precio) <= 0) {
                    this.errores.precio = true;
                }
                if (!this.form.descripcion || this.form.descripcion.length < 10) {
                    this.errores.descripcion = true;
                }
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

                const response = await fetch('../backend/api/gestionar_producto.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                if (result.success) {
                    this.mostrarAlerta(`¡Operación "${this.form.operacion}" realizada con éxito!`, 'alert-success');
                    this.limpiarFormulario();
                } else {
                    this.mostrarAlerta('Error: ' + result.message, 'alert-danger');
                }
            } catch (error) {
                console.error('Error al guardar:', error);
                this.mostrarAlerta('Error de conexión al guardar', 'alert-danger');
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
        },

        limpiarFormulario() {
            this.form = { id_mueble: '', operacion: '', nombre: '', categoria: '', precio: '', descripcion: '', imagen_url: '' };
            this.archivoImagen = null;
            this.datosOriginales = null;
        }
    }
}).mount('#app');