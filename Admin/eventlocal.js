import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Firebase Config Object
const firebaseConfig = {
    apiKey: "AIzaSyAowxVHvpmYoluiKnn_M5NMaku9EqcqPDk",
    authDomain: "web-project-f0c9c.firebaseapp.com",
    projectId: "web-project-f0c9c",
    storageBucket: "web-project-f0c9c.appspot.com",
    messagingSenderId: "1025383417170",
    appId: "1:1025383417170:web:51d30811a47a97ae6a268b",
    measurementId: "G-DG1EX6H6PQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const eventoLocalCollection = collection(db, "eventoLocal");


document.getElementById("viajeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const actividades = document.getElementById("actividades").value;
    const categoria = document.getElementById("categoria").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const fecha = document.getElementById("fecha").value;

    try {
        await addDoc(eventoLocalCollection, {
            titulo,
            descripcion,
            actividades,
            categoria,
            ubicacion,
            fecha,
            fechaCreacion: new Date()
        });
        Swal.fire({
            text: "Viaje guardado con éxito.",
            imageUrl: "/asset/MemeAlerts/the-success-kid.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "the-success-kid.jpg"
        });
        document.getElementById("viajeForm").reset();
    } catch (error) {
        console.error("Error al guardar el viaje: ", error);
        Swal.fire({
            text: "Hubo un error al guardar el viaje. Intenta nuevamente.",
            imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
          });
    }
});