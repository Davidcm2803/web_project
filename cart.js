import { auth, db } from './firebaseConfig.js';
import { collection, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

let pagoRealizado = false;

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario autenticado:", user);
        if (!pagoRealizado) { 
            cargarCarrito(user.uid);
        } else {
            mostrarHistorialDeCompras(user.uid);  // Mostrar historial si el pago fue realizado
        }
    } else {
        console.log("No hay usuario autenticado.");
        alert("Por favor, inicia sesión para ver tu carrito.");
    }
});

// Cargar el carrito
async function cargarCarrito(userId) {
    try {
        const cartRef = collection(db, 'carrito', userId, 'tours');
        const querySnapshot = await getDocs(cartRef);

        const productList = document.getElementById('product-list');
        const cartCount = document.getElementById('cart-count');
        const sortSelect = document.getElementById('sort-price');
        let total = 0;

        if (querySnapshot.empty) {
            cartCount.innerText = "You have 0 items in your cart";
        } else {
            let products = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                products.push({ ...data, id: doc.id }); 
                total += parseFloat(data.price.replace('$', '').replace(',', ''));
            });

            // Función para ordenar los productos por precio
            const ordenarProductos = (orden) => {
                if (orden === 'asc') {
                    products.sort((a, b) => parseFloat(a.price.replace('$', '').replace(',', '')) - parseFloat(b.price.replace('$', '').replace(',', '')));
                } else {
                    products.sort((a, b) => parseFloat(b.price.replace('$', '').replace(',', '')) - parseFloat(a.price.replace('$', '').replace(',', '')));
                }
            };

            ordenarProductos(sortSelect.value);

            productList.innerHTML = '';
            products.forEach((product) => {
                const itemHtml = `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p><strong>Precio:</strong> ${product.price}</p>
                                <p><strong>Fecha:</strong> ${product.date}</p>
                                <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${product.id}')">
                                    <i class="fas fa-trash-alt"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += itemHtml;
            });

            // Actualizar el texto del carrito
            cartCount.innerText = `You have ${products.length} items in your cart`;

            // Actualizar el total
            document.getElementById('subtotal').innerText = `$${total.toFixed(2)}`;
            document.getElementById('total').innerText = `$${(total + 10).toFixed(2)}`;  // Incluyendo el costo de envío de $10

            // Actualizar el botón de checkout
            document.getElementById('checkout-amount').innerText = `$${(total + 10).toFixed(2)}`;
        }
    } catch (error) {
        console.error("Error al obtener los datos del carrito:", error);
    }
}

// Función para eliminar un producto del carrito
async function eliminarProducto(productId) {
    try {
        const productRef = doc(db, 'carrito', auth.currentUser.uid, 'tours', productId);

        await deleteDoc(productRef);
        cargarCarrito(auth.currentUser.uid);

        console.log(`Producto ${productId} eliminado del carrito.`);
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
    }
}

// Hacer que la función sea global
window.eliminarProducto = eliminarProducto;
document.getElementById('sort-price').addEventListener('change', (event) => {
    const sortOrder = event.target.value;
    cargarCarrito(auth.currentUser.uid);
});

// Función para marcar que el pago fue realizado
export function marcarPagoRealizado() {
    pagoRealizado = true; 
}

// Función para mostrar el historial de compras
async function mostrarHistorialDeCompras(userId) {
    try {
        const comprasRef = collection(db, 'compras', userId, 'comprados');
        const querySnapshot = await getDocs(comprasRef);
        const historialElement = document.getElementById('historial-compras');
        historialElement.innerHTML = '';  // Limpiar historial anterior

        if (querySnapshot.empty) {
            historialElement.innerHTML = '<p>No has comprado nada aún.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const producto = doc.data();
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
    } catch (error) {
        console.error('Error al recuperar historial de compras:', error);
    }
}



