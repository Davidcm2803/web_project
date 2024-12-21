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

const viajeForm = document.getElementById("viajeForm");
const viajesContainer = document.getElementById("viajesContainer");
let editingId = null;

// Función para guardar un nuevo viaje
async function addViaje(viaje) {
  try {
    await db.collection("viajes").add(viaje);
    Swal.fire({
      text: "Viaje guardado con éxito.",
      imageUrl: "/asset/MemeAlerts/the-success-kid.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "the-success-kid.jpg"
    });
  } catch (error) {
    console.error("Error al guardar el viaje:", error);
    Swal.fire({
      text: "Hubo un error al guardar el viaje. Intenta nuevamente.",
      imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
    });
  }
}

// Función para actualizar un viaje existente
async function updateViaje(id, viaje) {
  try {
    await db.collection("viajes").doc(id).update(viaje);
    Swal.fire({
      text: "Viaje actualizado con éxito.",
      imageUrl: "/asset/MemeAlerts/updated.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "updated.jpg"
    });
  } catch (error) {
    console.error("Error al actualizar el viaje:", error);
    Swal.fire({
      text: "Hubo un error al actualizar el viaje. Intenta nuevamente.",
      imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
    });
  }
}

// Validar si una URL es válida
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Manejar el envío del formulario
viajeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = viajeForm.titulo.value.trim();
  const descripcion = viajeForm.descripcion.value.trim();
  const precio = parseFloat(viajeForm.precio.value);
  const actividades = viajeForm.actividades.value.trim();
  const imagenUrl = viajeForm.imagenUrl.value.trim();
  const categoria = viajeForm.categoria.value;
  const ubicacion = viajeForm.ubicacion.value.trim();
  const fechasDisponibles = viajeForm.fechasDisponibles.value.trim();

  if (!imagenUrl || !ubicacion || !isValidUrl(imagenUrl) || !isValidUrl(ubicacion)) {
    Swal.fire({
      text: "Por favor, ingresa URLs válidas para la imagen y la ubicación.",
      imageUrl: "/asset/MemeAlerts/wrong-data-meme.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "wrong-data-meme.jpg"
    });
    return;
  }

  const viaje = { titulo, descripcion, precio, actividades, imagenUrl, categoria, ubicacion, fechasDisponibles };

  if (editingId) {
    await updateViaje(editingId, viaje);
    editingId = null;
  } else {

    await addViaje(viaje);
  }

  viajeForm.reset();
});


db.collection("viajes").onSnapshot((querySnapshot) => {
  viajesContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const { titulo, descripcion, precio, actividades, imagenUrl, categoria, ubicacion, fechasDisponibles } = doc.data();
    const id = doc.id;


    const actividadesLista = actividades
      .split(/\r?\n|,/) 
      .map((actividad) => `<li>${actividad.trim()}</li>`)
      .join("");

    const fechasLista = fechasDisponibles
      .split(",")
      .map((fecha) => `<li>${fecha.trim()}</li>`)
      .join("");

    const viajeDiv = document.createElement("div");
    viajeDiv.classList.add("viaje", "col-md-4");

    viajeDiv.innerHTML = `
      <div class="card h-100">
        <img src="${imagenUrl}" alt="${titulo}" class="card-img-top" style="max-height: 200px; object-fit: cover;">
        <div class="card-body">
          <h3 class="card-title">${titulo}</h3>
          <p class="card-text">${descripcion}</p>
          <p><strong>Precio:</strong> $${precio}</p>
          <p><strong>Actividades:</strong></p>
          <ul>${actividadesLista}</ul>
          <p><strong>Fechas Disponibles:</strong></p>
          <ul>${fechasLista}</ul>
          <p><strong>Categoría:</strong> ${categoria}</p>
          <p><strong>Ubicación:</strong> <a href="${ubicacion}" target="_blank">Ver en Google Maps</a></p>
          <button class="btn btn-warning btn-sm mt-2" onclick="startEdit('${id}')">Editar</button>
          <button class="btn btn-danger btn-sm mt-2" onclick="deleteViaje('${id}')">Eliminar</button>
        </div>
      </div>
    `;

    viajesContainer.appendChild(viajeDiv);
  });
});

function startEdit(id) {
  db.collection("viajes")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        Swal.fire({
          text: "El viaje no existe.",
          imageUrl: "/asset/MemeAlerts/no-existe.jpg",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "no-existe.jpg"
        });
        return;
      }

      const { titulo, descripcion, precio, actividades, imagenUrl, categoria, ubicacion, fechasDisponibles } = doc.data();

      viajeForm.titulo.value = titulo;
      viajeForm.descripcion.value = descripcion;
      viajeForm.precio.value = precio;
      viajeForm.actividades.value = actividades;
      viajeForm.imagenUrl.value = imagenUrl;
      viajeForm.categoria.value = categoria;
      viajeForm.ubicacion.value = ubicacion;
      viajeForm.fechasDisponibles.value = fechasDisponibles;

      editingId = id;
    })
    .catch((error) => {
      console.error("Error al obtener el viaje:", error);
      Swal.fire({
        text: "Hubo un error al obtener los datos del viaje. Intenta nuevamente.",
        imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
      });
    });
}


// Registrar funciones globales
window.startEdit = startEdit;
window.deleteViaje = deleteViaje;

