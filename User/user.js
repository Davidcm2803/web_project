import { db, auth } from '../firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

// Escuchar el estado de autenticación
onAuthStateChanged(auth, (user) => {
    const userDropdownButton = document.getElementById("dropdownUser");

    if (user) {
        const userName = user.displayName || user.email.split('@')[0];
        userDropdownButton.innerHTML = `<i class="bi bi-person-circle"></i> ${userName}`;


        cargarHistorialDeCompras(user.uid);
    } else {
        userDropdownButton.innerHTML = `<i class="bi bi-person-circle"></i> User`;
    }
});

// Función para cargar el historial de compras
async function cargarHistorialDeCompras(userId) {
    try {
        const comprasRef = collection(db, 'compras', userId, 'comprados');
        const querySnapshot = await getDocs(comprasRef);
        const historialElement = document.getElementById('historial-compras');

        if (querySnapshot.empty) {
            historialElement.innerHTML = "<p>No tienes compras registradas.</p>";
        } else {
            historialElement.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const itemHtml = `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${data.image}" class="card-img-top" alt="${data.title}">
                            <div class="card-body">
                                <h5 class="card-title">${data.title}</h5>
                                <p><strong>Precio:</strong> ${data.price}</p>
                                <p><strong>Fecha:</strong> ${data.date}</p>
                            </div>
                        </div>
                    </div>
                `;
                historialElement.innerHTML += itemHtml;
            });
        }
    } catch (error) {
        console.error("Error al cargar el historial de compras:", error);
    }
}

const signOutButton = document.querySelector('.dropdown-item[href="#"]');
signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log("User logged out.");
        // Redirigir a la página de inicio
        window.location.href = '/index.html';
    }).catch((error) => {
        console.error("Error logging out:", error.message);
    });
});



