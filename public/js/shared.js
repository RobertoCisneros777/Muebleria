async function obtenerSesion() {
    try {
        const response = await fetch('../backend/auth/session.php');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la sesión:', error);
        return { logged_in: false };
    }
}

async function crearHeader() {
    const sesion = await obtenerSesion();
    const esPaginaAdmin = window.location.pathname.includes('formulario.html');
    const esPaginaUsuarios = window.location.pathname.includes('usuarios.html');
    
    let navLinks = '';
    let authSection = '';
    let cartSection = '';

    // Lógica del carrito
    const carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
    const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

    if (!esPaginaAdmin && !esPaginaUsuarios) {
        cartSection = `
            <div class="cart-icon" style="margin-left: 20px; position: relative; cursor: pointer;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span id="cart-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
                    ${cantidadCarrito}
                </span>
            </div>
        `;
    }

    if (esPaginaAdmin || esPaginaUsuarios) {
        // Menú simplificado y cruzado para administración
        navLinks = `
            <a href="index.html">Ir al Inicio</a>
            <a href="catalogo.html">Ir al Catálogo</a>
        `;
        
        if (esPaginaAdmin) {
            navLinks += `<a href="usuarios.html">Gestión Usuarios</a>`;
        } else {
            navLinks += `<a href="formulario.html">Gestión Productos</a>`;
        }
        
        authSection = ''; // No mostrar usuario ni cerrar sesión aquí
    } else {
        // Menú completo para el sitio público
        navLinks = `
            <a href="index.html">Inicio</a>
            <a href="mision.html">Misión</a>
            <a href="vision.html">Visión</a>
            <a href="contacto.html">Contacto</a>
            <a href="catalogo.html">Catálogo</a>
        `;

        if (sesion.logged_in && sesion.user.rol.toLowerCase().trim() === 'admin') {
            navLinks += `
                <a href="formulario.html">Gestión Productos</a>
                <a href="usuarios.html">Gestión Usuarios</a>
            `;
        }

        if (sesion.logged_in) {
            authSection = `
                <div class="dropdown" style="margin-left: 20px;">
                    <button class="btn border-0 p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 12px; margin-top: 10px;">
                        <li><h6 class="dropdown-header">Hola, ${sesion.user.nombre}</h6></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="../backend/auth/logout.php">Cerrar Sesión</a></li>
                    </ul>
                </div>
            `;
        } else {
            authSection = `
                <div class="dropdown" style="margin-left: 20px;">
                    <button class="btn border-0 p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-person-circle text-secondary" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 12px; margin-top: 10px;">
                        <li><a class="dropdown-item" href="login.html">Iniciar Sesión</a></li>
                    </ul>
                </div>
            `;
        }
    }

    const esCualquierPaginaAdmin = esPaginaAdmin || esPaginaUsuarios;

    const logoStyle = esCualquierPaginaAdmin 
        ? 'text-align: center; width: 100%; margin-bottom: 15px;' 
        : 'text-align: left;';
    
    const navStyle = esCualquierPaginaAdmin 
        ? 'width: 100%; display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;' 
        : 'margin-left: auto; display: flex; align-items: center;';

    return `
        <div class="logo-container" style="${logoStyle}">
            <h1 style="margin:0; font-size: 2rem;">Muebles Nova</h1>
            <p style="margin:0; font-size: 0.9rem; color: #888;">Aquí está lo mejor</p>
        </div>
        <nav class="nav-links" style="${navStyle}">
            ${navLinks}
            ${cartSection}
            ${authSection}
        </nav>

        <!-- Offcanvas del Carrito -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCarrito" aria-labelledby="offcanvasCarritoLabel" role="dialog">
            <div class="offcanvas-header border-bottom">
                <h2 class="offcanvas-title fw-bold h5 mb-0" id="offcanvasCarritoLabel">Mi Carrito</h2>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column" id="carrito-body">
                <!-- El contenido se inyecta por JS -->
            </div>
        </div>
    `;
}

function crearFooter() {
    return `
        <p>&copy; 2024 Muebles Nova. All rights reserved</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 15px;">
            <a href="https://validator.w3.org/nu/?doc=https://robertocisneros777.github.io/Muebleria/" style="display: inline-flex;">
                <img src="https://www.w3.org/Icons/valid-html401" alt="Valid HTML!" height="31" width="88">
            </a>
            <a href="https://jigsaw.w3.org/css-validator/validator?uri=https://robertocisneros777.github.io/Muebleria/css/estilos.css" style="display: inline-flex;">
                <img src="https://jigsaw.w3.org/css-validator/images/vcss" alt="CSS Válido!" height="31" width="88">
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async function() {
    const headerElement = document.querySelector('header');
    const esPaginaAdmin = window.location.pathname.includes('formulario.html') || window.location.pathname.includes('usuarios.html');

    if (headerElement) {
        headerElement.classList.add('header');
        
        if (esPaginaAdmin) {
            headerElement.style.flexDirection = 'column';
            headerElement.style.textAlign = 'center';
        } else {
            headerElement.style.flexDirection = 'row';
            headerElement.style.justifyContent = 'space-between';
        }
        
        const headerHTML = await crearHeader();
        headerElement.innerHTML = headerHTML;
    }

    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = crearFooter();
    }

    renderizarCarrito();
});

// Funciones globales del carrito
window.actualizarBadgeCarrito = function() {
    const carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = cantidad;
    renderizarCarrito();
};

window.addEventListener('carritoActualizado', window.actualizarBadgeCarrito);

function renderizarCarrito() {
    const carritoBody = document.getElementById('carrito-body');
    if (!carritoBody) return;

    const carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
    
    if (carrito.length === 0) {
        carritoBody.innerHTML = `
            <div class="text-center text-muted mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-cart-x mb-3" viewBox="0 0 16 16">
                  <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }

    let html = '<div class="flex-grow-1 overflow-auto">';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="${item.img}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${item.nombre}</h6>
                    <small class="text-muted">$${item.precio.toLocaleString('es-MX', {minimumFractionDigits: 2})}</small>
                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span class="mx-2">${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="btn btn-sm text-danger border-0" onclick="eliminarDelCarrito(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.813 1H3.188l-.83 10.364A1 1 0 0 0 3.354 15h9.292a1 1 0 0 0 .996-1.136L12.813 3.5ZM8 5.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Zm-5 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Z"/></svg>
                </button>
            </div>
        `;
    });

    html += `</div>
        <div class="mt-auto pt-3 border-top">
            <div class="d-flex justify-content-between mb-3">
                <span class="fw-bold">Total:</span>
                <span class="fw-bold fs-5 text-dark">$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
            </div>
            <button class="btn btn-dark w-100 py-2 fw-bold" onclick="procederPago()">Proceder al Pago</button>
        </div>
    `;

    carritoBody.innerHTML = html;
}

window.mostrarAlertaGlobal = function(mensaje, tipo = 'success') {
    const existingAlert = document.getElementById('alerta-global');
    if (existingAlert) existingAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.id = 'alerta-global';
    alertDiv.className = `alert alert-${tipo} position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg d-flex align-items-center animacion-entrada`;
    alertDiv.style.cssText = 'z-index: 9999; min-width: 350px; border-radius: 12px; transition: opacity 0.5s ease-in-out;';
    
    let iconSvg = '';
    if (tipo === 'success') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill me-3" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`;
    } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill me-3" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`;
    }

    alertDiv.innerHTML = `
        ${iconSvg}
        <div>${mensaje}</div>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
};

window.procederPago = async function() {
    try {
        const response = await fetch('../backend/auth/session.php');
        const sesion = await response.json();
        
        if (sesion.logged_in) {
            if (sesion.user.rol.toLowerCase().trim() === 'cliente') {
                mostrarAlertaGlobal('¡Pago procesado con éxito! Gracias por tu compra.', 'success');
                
                // Vaciar el carrito
                localStorage.removeItem('carritoMuebles');
                window.dispatchEvent(new Event('carritoActualizado'));
                
                // Cerrar el panel lateral después de un segundo
                setTimeout(() => {
                    const offcanvasEl = document.getElementById('offcanvasCarrito');
                    if (offcanvasEl && window.bootstrap) {
                        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                        if (offcanvasInstance) offcanvasInstance.hide();
                    }
                }, 1500);

            } else {
                mostrarAlertaGlobal('Los administradores no pueden realizar compras.', 'danger');
            }
        } else {
            mostrarAlertaGlobal('Debes iniciar sesión para comprar. Redirigiendo...', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        mostrarAlertaGlobal('Hubo un error de conexión.', 'danger');
    }
};

window.cambiarCantidad = function(index, delta) {
    let carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
    if (carrito[index]) {
        carrito[index].cantidad += delta;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        localStorage.setItem('carritoMuebles', JSON.stringify(carrito));
        window.dispatchEvent(new Event('carritoActualizado'));
    }
};

window.eliminarDelCarrito = function(index) {
    let carrito = JSON.parse(localStorage.getItem('carritoMuebles')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carritoMuebles', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoActualizado'));
};
