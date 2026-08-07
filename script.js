```javascript
/* =====================================================
   KINGCAP - SCRIPT.JS
   Carrito + pedidos + WhatsApp + Nequi
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const WHATSAPP_NUMBER = "573219272653";

// IMPORTANTE:
// Cuando tengas tu LINK REAL de pago de Nequi,
// reemplaza el valor de abajo.
const NEQUI_PAYMENT_LINK = "https://nequi.com.co/";


/* =====================================================
   PRODUCTOS
===================================================== */

const products = [

    {
        id: 1,
        name: "Gorra KingCap Black",
        price: 50000,
        image: "img/gorra1.jpg"
    },

    {
        id: 2,
        name: "Gorra KingCap White",
        price: 50000,
        image: "img/gorra2.jpg"
    },

    {
        id: 3,
        name: "Gorra KingCap Red",
        price: 50000,
        image: "img/gorra3.jpg"
    },

    {
        id: 4,
        name: "Gorra KingCap Premium",
        price: 60000,
        image: "img/gorra4.jpg"
    }

];


/* =====================================================
   CARRITO
===================================================== */

let cart = JSON.parse(localStorage.getItem("kingcapCart")) || [];


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const cartElement = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const emptyCart = document.getElementById("emptyCart");
const cartFooter = document.getElementById("cartFooter");

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");


/* =====================================================
   FORMATEAR PESOS COLOMBIANOS
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat("es-CO", {

        style: "currency",

        currency: "COP",

        maximumFractionDigits: 0

    }).format(price);

}


/* =====================================================
   GUARDAR CARRITO
===================================================== */

function saveCart() {

    localStorage.setItem(
        "kingcapCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   ABRIR CARRITO
===================================================== */

function openCart() {

    cartElement.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   CERRAR CARRITO
===================================================== */

function closeCart() {

    cartElement.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* =====================================================
   EVENTOS DEL CARRITO
===================================================== */

openCartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* =====================================================
   AGREGAR PRODUCTO
===================================================== */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    openCart();


    /* Animación del contador */

    cartCount.style.transform = "scale(1.4)";

    setTimeout(() => {

        cartCount.style.transform = "scale(1)";

    }, 200);

}


/* =====================================================
   AUMENTAR CANTIDAD
===================================================== */

function increaseQuantity(productId) {

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;

    product.quantity += 1;

    saveCart();

    renderCart();

}


/* =====================================================
   DISMINUIR CANTIDAD
===================================================== */

function decreaseQuantity(productId) {

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;


    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        cart = cart.filter(
            item => item.id !== productId
        );

    }


    saveCart();

    renderCart();

}


/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();

}


/* =====================================================
   CALCULAR TOTAL
===================================================== */

function calculateTotal() {

    return cart.reduce(

        (total, item) => {

            return total +
                (item.price * item.quantity);

        },

        0

    );

}


/* =====================================================
   CANTIDAD TOTAL DE PRODUCTOS
===================================================== */

function calculateItems() {

    return cart.reduce(

        (total, item) => {

            return total + item.quantity;

        },

        0

    );

}


/* =====================================================
   MOSTRAR CARRITO
===================================================== */

function renderCart() {

    cartItems.innerHTML = "";


    /* Contador */

    cartCount.textContent = calculateItems();


    /* Carrito vacío */

    if (cart.length === 0) {

        emptyCart.style.display = "flex";

        cartFooter.style.display = "none";

        return;

    }


    emptyCart.style.display = "none";

    cartFooter.style.display = "block";


    /* Productos */

    cart.forEach(product => {

        const item = document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ${formatPrice(product.price)}
                </p>


                <div class="quantity-control">

                    <button
                        onclick="decreaseQuantity(${product.id})">

                        −

                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        onclick="increaseQuantity(${product.id})">

                        +

                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${product.id})"
                title="Eliminar">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        cartItems.appendChild(item);

    });


    /* Total */

    cartTotal.textContent =
        formatPrice(calculateTotal());

}


/* =====================================================
   ABRIR FORMULARIO DE CHECKOUT
===================================================== */

function openCheckoutModal() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega una gorra primero."
        );

        return;

    }


    checkoutModal.classList.add("active");

}


/* =====================================================
   CERRAR FORMULARIO
===================================================== */

function closeCheckoutModal() {

    checkoutModal.classList.remove("active");

}


/* =====================================================
   COMPRAR POR WHATSAPP
===================================================== */

function checkoutWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega una gorra primero."
        );

        return;

    }


    openCheckoutModal();

}


/* =====================================================
   FORMULARIO DE PEDIDO
===================================================== */

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById("customerName").value.trim();

        const city =
            document.getElementById("customerCity").value.trim();

        const address =
            document.getElementById("customerAddress").value.trim();

        const payment =
            document.getElementById("paymentMethod").value;


        if (
            !name ||
            !city ||
            !address
        ) {

            alert(
                "Por favor completa todos los datos."
            );

            return;

        }


        /* Crear lista del pedido */

        let orderText =
            "🧢 *NUEVO PEDIDO - KINGCAP*%0A%0A";


        orderText +=
            "👤 *Cliente:* " +
            encodeURIComponent(name) +
            "%0A";


        orderText +=
            "📍 *Ciudad:* " +
            encodeURIComponent(city) +
            "%0A";


        orderText +=
            "🏠 *Dirección:* " +
            encodeURIComponent(address) +
            "%0A";


        orderText +=
            "💳 *Pago:* " +
            encodeURIComponent(payment) +
            "%0A%0A";


        orderText +=
            "🛒 *PRODUCTOS:*%0A";


        cart.forEach(product => {

            orderText +=

                "• " +
                encodeURIComponent(product.name) +
                " x" +
                product.quantity +
                " - " +
                encodeURIComponent(
                    formatPrice(
                        product.price *
                        product.quantity
                    )
                ) +
                "%0A";

        });


        orderText += "%0A";


        orderText +=
            "💰 *TOTAL:* " +
            encodeURIComponent(
                formatPrice(
                    calculateTotal()
                )
            );


        /* URL DE WHATSAPP */

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${orderText}`;


        /* Abrir WhatsApp */

        window.open(
            whatsappURL,
            "_blank"
        );


        /* Cerrar modal */

        closeCheckoutModal();


        /*
            IMPORTANTE:
            No vaciamos el carrito automáticamente.
            Así el cliente puede volver a revisar
            el pedido si lo necesita.
        */

    }
);


/* =====================================================
   PAGO CON NEQUI
===================================================== */

function checkoutNequi() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega una gorra primero."
        );

        return;

    }


    const total = calculateTotal();


    const confirmPayment = confirm(

        "Vas a pagar " +
        formatPrice(total) +
        " mediante Nequi.\n\n" +

        "Después de realizar el pago, " +
        "envíanos el comprobante por WhatsApp."

    );


    if (!confirmPayment) {

        return;

    }


    /*
        ABRIR LINK DE PAGO

        Cuando tengas tu verdadero link
        de pago de Nequi Negocios,
        reemplaza NEQUI_PAYMENT_LINK
        arriba.
    */

    window.open(
        NEQUI_PAYMENT_LINK,
        "_blank"
    );


    /*
        Abrir WhatsApp para enviar comprobante
    */

    setTimeout(() => {

        const message =

            "Hola KingCap 👋%0A%0A" +

            "Acabo de realizar un pago por " +

            encodeURIComponent(
                formatPrice(total)
            ) +

            ".%0A%0A" +

            "Quiero enviar el comprobante de pago.";

        window.open(

            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,

            "_blank"

        );

    }, 1200);

}


/* =====================================================
   CERRAR MODAL AL HACER CLICK AFUERA
===================================================== */

checkoutModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === checkoutModal
        ) {

            closeCheckoutModal();

        }

    }
);


/* =====================================================
   ESC PARA CERRAR
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeCart();

            closeCheckoutModal();

        }

    }
);


/* =====================================================
   ANIMACIÓN DEL CONTADOR
===================================================== */

const style = document.createElement("style");

style.textContent = `

    #cartCount {

        transition:
            transform 0.2s ease;

    }

`;

document.head.appendChild(style);


/* =====================================================
   INICIAR TIENDA
===================================================== */

renderCart();


/* =====================================================
   MENSAJE EN CONSOLA
===================================================== */

console.log(
    "🧢 KingCap - Tienda cargada correctamente."
);

console.log(
    "📲 WhatsApp:",
    WHATSAPP_NUMBER
);
```
