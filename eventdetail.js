// Importamos la configuración de Firebase y las funcionalidades necesarias
import { auth, db } from './firebaseConfig.js';  // Asegúrate de que la ruta sea correcta

import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title') || 'Sin título';
const price = urlParams.get('price') || 'Precio no disponible';
const image = urlParams.get('image') || 'default-image.jpg';
const description = urlParams.get('description') || 'Descripción no disponible';
const category = urlParams.get('category') || 'Sin categoría';
const tourLocation = urlParams.get('location') || '';
const activities = urlParams.get('activities') ? urlParams.get('activities').split('\n') : [];
const date = urlParams.get('date');

// Asignar valores a los elementos
document.getElementById('tour-title').innerText = title;
document.getElementById('tour-price').innerText = `$${price}`;
document.getElementById('tour-image').src = image;
document.getElementById('tour-description').innerText = description;
document.getElementById('tour-category').innerText = category;

const activitiesList = document.getElementById('tour-activities');
activities.forEach(activity => {
    const li = document.createElement('li');
    li.textContent = activity;
    activitiesList.appendChild(li);
});

if (date) {
    const dateInput = document.getElementById('tour-date');
    dateInput.value = date;
    dateInput.setAttribute('min', date);
    dateInput.setAttribute('max', date);
}

const googleMapLink = document.getElementById('google-map-link');
if (tourLocation) {
    googleMapLink.href = tourLocation;
}

// Función para agregar el tour al carrito
document.querySelector('.order-button').addEventListener('click', async function () {
    // Obtener los detalles del tour desde los elementos HTML
    const title = document.getElementById('tour-title').innerText;
    const price = document.getElementById('tour-price').innerText;
    const description = document.getElementById('tour-description').innerText;
    const image = document.getElementById('tour-image').src;
    const date = document.getElementById('tour-date').value;

    // Verifica si el usuario está autenticado
    const user = auth.currentUser;
    console.log("Usuario logueado:", user); // Añadir un log para ver si 'user' es válido
    if (user) {
        const userId = user.uid;

        // Agregar el tour al carrito en Firestore
        try {
            await addDoc(collection(db, 'carrito', userId, 'tours'), {
                title: title,
                price: price,
                description: description,
                image: image,
                date: date
            });
            alert("Tour agregado al carrito");
        } catch (error) {
            console.error("Error al agregar al carrito: ", error);
            alert("Hubo un error al agregar el tour al carrito. Intenta de nuevo.");
        }
    } else {
        console.log("Usuario no logueado. No se puede agregar al carrito.");
        alert("Por favor, inicia sesión para agregar al carrito.");
    }
});
