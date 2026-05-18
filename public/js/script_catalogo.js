const app = Vue.createApp({
    template: '#app-template',
    data() {
        return {
            alertaVisible: false,
            mensajeAlerta: '',
            categoriaSeleccionada: 'Todos los productos',
            productos: []
        };
    },
    mounted() {
        this.cargarProductos();
    },
    computed: {
        productosFiltrados() {
            if (this.categoriaSeleccionada === 'Todos los productos') {
                return this.productos;
            }
            // Filtro flexible que ignora mayúsculas y espacios
            const catSelec = this.categoriaSeleccionada.toLowerCase().trim();
            return this.productos.filter(producto => {
                if (!producto.categoria) return false;
                return producto.categoria.toLowerCase().trim() === catSelec;
            });
        }
    },
    methods: {
        async cargarProductos() {
            console.log('Iniciando carga de productos...');
            try {
                const response = await fetch('../backend/api/get_productos.php');
                const data = await response.json();
                console.log('Datos recibidos:', data);
                
                if (data.error) {
                    window.mostrarAlertaGlobal('Error del servidor: ' + data.message, 'danger');
                } else {
                    this.productos = data;
                    if (this.productos.length === 0) {
                        console.warn('La base de datos devolvió 0 productos.');
                    }
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
                window.mostrarAlertaGlobal('No se pudo conectar con la API de productos. Revisa la consola (F12).', 'danger');
            }
        },
        filtrarPorCategoria(categoria) {
            this.categoriaSeleccionada = categoria;
        },
        agregarAlCarrito(producto) {
            let carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
            let itemExistente = carrito.find(item => item.id === producto.id);
            
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    img: producto.img,
                    cantidad: 1
                });
            }
            
            localStorage.setItem('carritoMuebles', JSON.stringify(carrito));
            window.dispatchEvent(new Event('carritoActualizado'));
            window.mostrarAlertaGlobal(`¡Se agregó "${producto.nombre}" al carrito!`, 'success');
        }
    }
});

app.mount('#app');