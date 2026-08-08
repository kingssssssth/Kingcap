// ========================================
// CARRITO DE COMPRAS — Kingcaps
// ========================================

// Variables principales
let carrito = [];
const modal = document.getElementById('modalCarrito');
const verCarritoBtn = document.getElementById('verCarrito');
const cerrarModal = document.querySelector('.cerrar');
const listaCarrito = document.getElementById('listaCarrito');
const cantidadCarrito = document.getElementById('cantidadCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const botonComprar = document.getElementById('botonComprar');

// Números de WhatsApp
const numerosWhatsApp = [
    "573003983775",
    "573219272643",
    "573228896147"
];

// ========================================
// ABRIR Y CERRAR VENTANA DEL CARRITO
// ========================================

verCarritoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = "flex";
});

cerrarModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Cerrar si se hace clic fuera de la ventana
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ========================================
// AGREGAR PRODUCTOS AL CARRITO
// ========================================

// Escuchar todos los botones "Agregar al carrito"
document.querySelectorAll('.btn-agregar').forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseInt(boton.getAttribute('data-precio'));

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);

        if (productoExistente) {
            // Si ya existe, aumentar cantidad
            productoExistente.cantidad++;
        } else {
            // Si no existe, agregarlo nuevo
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        actualizarCarrito();
        mostrarNotificacion(nombre);
    });
});

// ========================================
// ACTUALIZAR VISTA DEL CARRITO
// ========================================

function actualizarCarrito() {
    // Limpiar lista
    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    // Recorrer productos y dibujarlos
    carrito.forEach((item, indice) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;

        const elemento = document.createElement('div');
        elemento.className = "item-carrito";
        elemento.innerHTML = `
            <div>
                <div class="info-nombre">${item.nombre}</div>
                <div class="info-precio">$ ${formatearNumero(item.precio)} COP × ${item.cantidad} = $ ${formatearNumero(subtotal)} COP</div>
            </div>
            <button class="eliminar" data-indice="${indice}">✕ Quitar</button>
        `;
        listaCarrito.appendChild(elemento);
    });

    // Actualizar contador y total
    cantidadCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = formatearNumero(total);

    // Agregar eventos a los botones "Eliminar"
    document.querySelectorAll('.eliminar').forEach(boton => {
        boton.addEventListener('click', () => {
            const indice = parseInt(boton.getAttribute('data-indice'));
            carrito.splice(indice, 1);
            actualizarCarrito();
        });
    });
}

// ========================================
// ENVIAR PEDIDO POR WHATSAPP
// ========================================

botonComprar.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío. Agrega gorras antes de comprar.");
        return;
    }

    // Construir el mensaje
    let mensaje = "👋 ¡Hola! Quiero hacer un pedido en Kingcaps 👑\n\n";
    mensaje += "📋 PEDIDO:\n";

    let totalGeneral = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `• ${item.nombre} — ${item.cantidad} unidad(es) — $ ${formatearNumero(subtotal)} COP\n`;
    });

    mensaje += `\n💰 TOTAL: $ ${formatearNumero(totalGeneral)} COP\n\n`;
    mensaje += "📦 Por favor confírmame disponibilidad y medios de pago. ¡Gracias!";

    // Codificar mensaje para enlace
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Abrir con el primer número de WhatsApp
    const enlace = `https://wa.me/${numerosWhatsApp[0]}?text=${mensajeCodificado}`;
    window.open(enlace, "_blank");

    // Cerrar carrito y vaciarlo
    carrito = [];
    actualizarCarrito();
    modal.style.display = "none";
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Formatear números con puntos de miles
function formatearNumero(numero) {
    return numero.toLocaleString('es-CO');
}

// Mostrar notificación al agregar producto
function mostrarNotificacion(nombre) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #212529;
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        z-index: 9999;
        font-weight: 500;
        animation: notifAparece 0.3s ease-out;
    `;
    notificacion.textContent = `✅ "${nombre}" agregado al carrito`;

    // Agregar animación
    const estilo = document.createElement('style');
    estilo.textContent = `
        @keyframes notifAparece {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(estilo);
    document.body.appendChild(notificacion);

    // Quitar notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = "0";
        notificacion.style.transition = "opacity 0.3s ease";
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}