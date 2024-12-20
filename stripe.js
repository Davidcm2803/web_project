import { marcarPagoRealizado } from './cart.js';
import { db, auth } from './firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

const stripe = Stripe('pk_test_51QUZgnCMWsISX1jCAl94RCyZN5ye5TJKiPsZ6jQkOgrgiXu4QyEZHoke9y08MgIMIcsOQTbdoLqfg6bwx0WDZ44800usSQVNsW');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const paymentForm = document.getElementById('payment-form');
const checkoutButton = document.getElementById('checkout-button');
const checkoutAmount = document.getElementById('checkout-amount');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

// Maneja el evento de envío del formulario
paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const postalCode = document.getElementById('postal-code').value;

    // Crear el token con la dirección completa (nombre, código postal, etc.)
    const { token, error } = await stripe.createToken(cardElement, {
        address_zip: postalCode  // Incluir el código postal
    });

    if (error) {
        // Si hay un error, muestra el mensaje de error
        console.error('Error al crear el token:', error);
        alert('Error: ' + error.message);
        //agregar meme
    } else {
        // Simulando que el pago fue exitoso
        console.log('Token creado:', token);
        alert('¡Pago realizado con éxito!');
        //agregar meme

        // Vaciar el carrito en Firestore y registrar las compras
        try {
            const cartRef = collection(db, 'carrito', auth.currentUser.uid, 'tours');
            const querySnapshot = await getDocs(cartRef);

            // Verificar si hay productos en el carrito
            if (querySnapshot.empty) {
                console.log('El carrito está vacío.');
                alert('El carrito está vacío.');
                //agregar meme Carro vacio
                return;
            }

            // Array para guardar los productos comprados
            let productosComprados = [];

            for (const docSnap of querySnapshot.docs) {
                const data = docSnap.data();
                console.log('Guardando producto en "compras":', data);

                await setDoc(doc(db, 'compras', auth.currentUser.uid, 'comprados', docSnap.id), data);
                productosComprados.push(data);
                await deleteDoc(docSnap.ref);
                console.log('Producto eliminado del carrito:', docSnap.id);
            }

            console.log('Carrito vacío después del pago y productos guardados en compras');

            mostrarHistorialDeCompras(productosComprados);

        } catch (error) {
            console.error("Error al vaciar el carrito y registrar la compra:", error);
        }

        document.getElementById('product-list').innerHTML = '';
        document.getElementById('cart-count').innerText = 'You have 0 items in your cart';

        marcarPagoRealizado();
    }
});

function mostrarHistorialDeCompras(productos) {
    const historialElement = document.getElementById('historial-compras');
    historialElement.innerHTML = ''; 

    if (productos.length === 0) {
        historialElement.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }

    productos.forEach(producto => {
        const itemHtml = `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p><strong>Precio:</strong> ${producto.price}</p>
                        <p><strong>Fecha:</strong> ${producto.date}</p>
                    </div>
                </div>
            </div>
        `;
        historialElement.innerHTML += itemHtml;
    });
}










