const app = Vue.createApp({
    data() {
        return {
            alertaVisible: false,
            mensajeAlerta: '',
            productos: [
                { id: 1, nombre: 'Mesa de centro Quetzal', precio: 11490.00, enOferta: true, img: 'img/mesa_centro_quetzal.jpg' },
                { id: 2, nombre: 'Sofá Selena Amarillo', precio: 34790.00, enOferta: false, img: 'img/sofa_selena_amarillo.jpg' },
                { id: 3, nombre: 'Mesa de Comedor Orleans', precio: 17790.00, enOferta: false, img: 'img/mesa_comedor_orleans.jpg' },
                { id: 4, nombre: 'Silla Tulip', precio: 6750.00, enOferta: false, img: 'img/silla_tullip.jpg' },
                { id: 5, nombre: 'Escritorio Celta', precio: 8900.00, enOferta: true, img: 'img/escritorio_celta.jpg' },
                { id: 6, nombre: 'Librero Bourbon', precio: 5400.00, enOferta: false, img: 'img/librero_bourbon.jpg' }
            ]
        };
    },
    methods: {
        agregarAlCarrito(producto) {
            this.mensajeAlerta = `¡Se agregó "${producto.nombre}" al carrito!`;
            this.alertaVisible = true;
            setTimeout(() => {
                this.alertaVisible = false;
            }, 3000);
        }
    }
});

app.mount('#app');