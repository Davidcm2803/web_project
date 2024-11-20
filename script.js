// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore,setDoc,doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAowxVHvpmYoluiKnn_M5NMaku9EqcqPDk",
    authDomain: "web-project-f0c9c.firebaseapp.com",
    projectId: "web-project-f0c9c",
    storageBucket: "web-project-f0c9c.appspot.com",
    messagingSenderId: "1025383417170",
    appId: "1:1025383417170:web:51d30811a47a97ae6a268b",
    measurementId: "G-DG1EX6H6PQ"
};

// Escuchar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // Selección de elementos para la navegación del formulario
    const formOpenBtn = document.querySelector("#form-open"),
          home = document.querySelector(".home"),
          formContainer = document.querySelector(".form_container"),
          formCloseBtn = document.querySelector(".form_close"),
          signupBtn = document.querySelector("#show-signup-form"),  // Botón para mostrar el formulario de registro
          loginBtn = document.querySelector("#show-login-form");    // Botón para mostrar el formulario de login

    // Mostrar el formulario al hacer clic en el ícono de usuario
    if (formOpenBtn) {
        formOpenBtn.addEventListener("click", () => {
            home.classList.add("show");
        });
    }

    // Cerrar el formulario al hacer clic en el ícono de cerrar
    if (formCloseBtn) {
        formCloseBtn.addEventListener("click", () => {
            home.classList.remove("show");
        });
    }

    // Cambiar a registro cuando se hace clic en "Sign Up"
    if (signupBtn && formContainer) {
        signupBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.querySelector('.login-form').classList.remove('active'); // Ocultar login
            formContainer.querySelector('.signup_form').classList.add('active');  // Mostrar signup
        });
    }

    // Cambiar a login cuando se hace clic en "Log In"
    if (loginBtn && formContainer) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.querySelector('.signup_form').classList.remove('active');  // Ocultar signup
            formContainer.querySelector('.login-form').classList.add('active'); // Mostrar login
        });
    }
});


    // Cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                alert("Has cerrado sesión correctamente.");
                // Opcional: Redirigir al inicio u otra página
                window.location.href = '/'; // Redirigir a la página de inicio
            }).catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
        });
    }






// Inicialización de Swiper
new Swiper(".swiper", {
    loop: true,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
});

document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById('searchBtn');
    const closeSearch = document.getElementById('closeSearch');
    const searchBox = document.getElementById('searchBox');

    if (searchBtn && closeSearch && searchBox) {
        searchBtn.onclick = function() {
            searchBox.classList.add('active');
            searchBtn.style.display = 'none';
        };

        closeSearch.onclick = function() {
            searchBox.classList.remove('active');
            searchBtn.style.display = 'block';
        };
    }
});

// Cargar detalles del evento
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        title: params.get('title'),
        price: params.get('price'),
        image: params.get('image'),
        description: params.get('description')
    };
}

function loadEventDetails() {
    const { title, price, image, description } = getQueryParams();

    const eventTitle = document.getElementById('event-title');
    const eventPrice = document.getElementById('event-price');
    const eventImage = document.getElementById('event-image');
    const eventDetail = document.querySelector('.event-detail');

    if (eventTitle) eventTitle.textContent = title || "Evento sin título";
    if (eventPrice) eventPrice.textContent = `Precio: $${price || 'No disponible'}`;
    if (eventImage) {
        eventImage.src = image || "ruta/imagen-predeterminada.jpg";
        eventImage.onerror = function() {
            console.error("Error: No se pudo cargar la imagen desde " + image);
            eventImage.alt = "Imagen no disponible";
        };
    }

    if (eventDetail) {
        const eventDescription = document.createElement('p');
        eventDescription.textContent = description || "Descripción no disponible";
        eventDescription.classList.add('event-description');
        eventDetail.appendChild(eventDescription);
    }
}

// Ejecutar la carga de detalles del evento al cargar la página
window.onload = loadEventDetails;

// Realizar la reserva
function makeBooking() {
    const date = document.getElementById('booking-date').value;
    if (date) {
        alert(`Reserva realizada para el ${date}.`);
    } else {
        alert("Por favor, selecciona una fecha.");
    }
}

