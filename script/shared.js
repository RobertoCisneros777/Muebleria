function crearHeader() {
    return `
        <header class="header">
            <div class="logo-container">
                <h1>Muebles Nova</h1>
                <p>Aquí está lo mejor</p>
            </div>
            <nav class="nav-links">
                <a href="index.html">Inicio</a>
                <a href="mision.html">Misión</a>
                <a href="vision.html">Visión</a>
                <a href="contacto.html">Contacto</a>
                <a href="catalogo.html">Catálogo</a>
            </nav>
        </header>
    `;
}

function crearFooter() {
    return `
        <footer>
            <p>&copy; 2024 Muebles Nova. All rights reserved</p>

            <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 15px;">
                <a href="https://validator.w3.org/nu/?doc=https://robertocisneros777.github.io/Muebleria/" style="display: inline-flex;">
                    <img src="https://www.w3.org/Icons/valid-html401" alt="Valid HTML!" height="31" width="88">
                </a>
                <a href="https://jigsaw.w3.org/css-validator/validator?uri=https://robertocisneros777.github.io/Muebleria/css/estilos.css" style="display: inline-flex;">
                    <img src="https://jigsaw.w3.org/css-validator/images/vcss" alt="CSS Válido!" height="31" width="88">
                </a>
            </div>
        </footer>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header && header.innerHTML.trim() === '') {
        header.outerHTML = crearHeader();
    }

    const footer = document.querySelector('footer');
    if (footer && footer.innerHTML.trim() === '') {
        footer.outerHTML = crearFooter();
    }
});
