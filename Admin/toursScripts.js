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

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Hacer la función deleteViaje accesible globalmente
window.deleteViaje = function(viajeId) {
  if (confirm("¿Estás seguro de que quieres eliminar este viaje?")) {
    // Eliminar el documento de Firebase
    db.collection("viajes").doc(viajeId).delete()
      .then(() => {
        alert("Viaje eliminado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar el viaje: ", error);
      });
  }
}

// Referencia al contenedor donde se mostrarán los viajes
const viajesContainer = document.getElementById("viajesContainer");

// Escuchar cambios en la colección de viajes
db.collection("viajes").onSnapshot((querySnapshot) => {
  viajesContainer.innerHTML = ""; // Limpiar el contenedor

  querySnapshot.forEach((doc) => {
    const { titulo, descripcion, precio, actividades, imagenUrl, categoria, ubicacion, fechasDisponibles } = doc.data();

    // Generar la lista de actividades
    const actividadesLista = actividades
      .split(/\r?\n|,/) // Separar por saltos de línea o comas
      .map((actividad) => `<li>${actividad.trim()}</li>`)
      .join("");

    // Verificar si fechasDisponibles existe antes de intentar usar split
    const fechasLista = (fechasDisponibles && fechasDisponibles.split(","))
      ? fechasDisponibles.split(",").map((fecha) => `<li>${fecha.trim()}</li>`).join("")
      : "<li>No disponible</li>";  // Si no hay fechas, mostrar un mensaje de "No disponible"

    const viajeDiv = document.createElement("div");
    viajeDiv.classList.add("viaje", "col-md-4");

    // Añadir HTML para el viaje, incluyendo un botón de eliminar
    viajeDiv.innerHTML = `
      <div class="card h-100">
        <img src="${imagenUrl}" alt="${titulo}" class="card-img-top" style="max-height: 200px; object-fit: cover;">
        <div class="card-body">
          <h3 class="card-title">${titulo}</h3>
          <p class="card-text">${descripcion}</p>
          <p><strong>Categoría:</strong> ${categoria}</p>
          <p><strong>Precio:</strong> $${precio}</p>
          <p><strong>Actividades:</strong></p>
          <ul>${actividadesLista}</ul>
          <p><strong>Fechas Disponibles:</strong></p>
          <ul>${fechasLista}</ul>
          <p><strong>Ubicación:</strong> <a href="${ubicacion}" target="_blank">Ver en Google Maps</a></p>
          <!-- Botón para eliminar -->
          <button class="btn btn-danger" data-id="${doc.id}" onclick="deleteViaje('${doc.id}')">Eliminar</button>
        </div>
      </div>
    `;

    // Añadir el viaje al contenedor
    viajesContainer.appendChild(viajeDiv);
  });
});
