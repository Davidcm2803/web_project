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

// Importar funciones de Firebase y Chart.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


async function cargarViajes() {
    try {
        const viajesCollection = collection(db, "viajes");
        const viajesSnapshot = await getDocs(viajesCollection);

        const categorias = {
            Museo: 0,
            Arte: 0,
            Cine: 0,
            Comida: 0,
            CulturaTica: 0,
            Teatro: 0,
            Tour: 0,
            Descuento: 0
        };

        viajesSnapshot.forEach(doc => {
            const viaje = doc.data();
            if (viaje.categoria === "Museo") {
                categorias.Museo++;
            } else if (viaje.categoria === "Arte") {
                categorias.Arte++;
            } else if (viaje.categoria === "Cine") {
                categorias.Cine++;
            } else if (viaje.categoria === "Comida") {
                categorias.Comida++;
            } else if (viaje.categoria === "Cultura tica") {
                categorias.CulturaTica++;
            } else if (viaje.categoria === "Teatro") {
                categorias.Teatro++;
            } else if (viaje.categoria === "Tour") {
                categorias.Tour++;
            } else if (viaje.categoria === "Descuento") {
                categorias.Descuento++;
            }
        });

        // Crear el gráfico de pastel con los datos de las categorías
        const pieChart = document.getElementById("pieChart");
        const ctx = pieChart.getContext('2d');
        const data = {
            labels: ['Museo', 'Arte', 'Cine', 'Comida', 'Cultura Tica', 'Teatro', 'Tour', 'Descuento'],
            datasets: [{
                label: 'Categorías de Viajes',
                data: [
                    categorias.Museo,
                    categorias.Arte,
                    categorias.Cine,
                    categorias.Comida,
                    categorias.CulturaTica,
                    categorias.Teatro,
                    categorias.Tour,
                    categorias.Descuento
                ],
                backgroundColor: [
                    '#bfc9ca', '#bb8fce', '#007BFF', '#FFC107',
                    '#e74c3c', '#85c1e9 ', '#9C27B0', '#28b463'
                ],
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw} viajes`;
                            }
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);

    } catch (error) {
        console.error("Error al cargar los viajes:", error);
    }
}

window.onload = cargarViajes;

if (refreshButton) {
    refreshButton.addEventListener('click', cargarViajes);
}