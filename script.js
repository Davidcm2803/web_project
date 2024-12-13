import { db, auth } from './firebaseConfig.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', function() {
    const formOpenBtn = document.querySelector("#form-open"),
          home = document.querySelector(".home"),
          formContainer = document.querySelector(".form_container"),
          formCloseBtn = document.querySelector(".form_close"),
          signupBtn = document.querySelector("#show-signup-form"),
          loginBtn = document.querySelector("#show-login-form"),
          searchBtn = document.querySelector("#searchBtn"),
          searchBox = document.querySelector("#searchBox"),
          closeSearchBtn = document.querySelector("#closeSearch"),
          searchInput = document.querySelector("#searchInput");

    // Mostrar formulario de login o signup
    if (formOpenBtn) {
        formOpenBtn.addEventListener("click", () => {
            home.classList.add("show");
        });
    }

    if (formCloseBtn) {
        formCloseBtn.addEventListener("click", () => {
            home.classList.remove("show");
        });
    }

    if (signupBtn && formContainer) {
        signupBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.querySelector('.login-form').classList.remove('active');
            formContainer.querySelector('.signup_form').classList.add('active'); 
        });
    }

    if (loginBtn && formContainer) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.querySelector('.signup_form').classList.remove('active');
            formContainer.querySelector('.login-form').classList.add('active');
        });
    }

    // Mostrar/ocultar el cuadro de búsqueda
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            searchBox.classList.toggle("active"); 
        });
    }

    // Cerrar el cuadro de búsqueda al hacer clic en el ícono de cerrar
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener("click", () => {
            searchBox.classList.remove("active");
        });
    }

    // Función de búsqueda
    if (searchInput) {
        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const searchQuery = event.target.value.trim();
                if (searchQuery) {
                    window.location.href = `/Views/searchResult.html?searchQuery=${encodeURIComponent(searchQuery)}`;
                } else {
                    alert("Por favor, ingresa un término de búsqueda.");
                }
            }
        });
    }
});

// Función para obtener elementos aleatorios
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Función para cargar los tours con categoría "descuento" en el carousel
async function loadTours() {
    const carouselList = document.querySelector('.swiper-wrapper');
    if (!carouselList) return;

    // Obtener los viajes desde la colección "viajes"
    const viajesCollection = collection(db, "viajes");

    // Filtrar los viajes por categoría "descuento"
    const querySnapshot = await getDocs(viajesCollection);
    const viajesArray = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((viaje) => viaje.categoria === "Descuento"); 

    console.log(viajesArray);

    // Seleccionar 7 tours aleatorios
    const selectedTours = getRandomItems(viajesArray, 7);
    console.log(selectedTours); 

    // Limpiar el contenido anterior
    carouselList.innerHTML = '';

    selectedTours.forEach((viaje) => {
        const viajeItem = document.createElement('li');
        viajeItem.classList.add('image-item', 'swiper-slide');

        const activities = Array.isArray(viaje.actividades) ? viaje.actividades.join(', ') : viaje.actividades || '';

        const fechasDisponibles = viaje.fechasDisponibles ? viaje.fechasDisponibles : ''; 

        viajeItem.innerHTML = `
            <img src="${viaje.imagenUrl}" alt="${viaje.titulo}" class="carousel-image">
            <div class="overlay">
                <div class="box-galery">
                    <p>From</p>
                    <h4>$${viaje.precio}</h4>
                </div>
                <h2 class="location">
                    <a href="/Views/eventDetail.html?title=${encodeURIComponent(viaje.titulo)}&price=${viaje.precio}&image=${encodeURIComponent(viaje.imagenUrl)}&description=${encodeURIComponent(viaje.descripcion)}&category=${encodeURIComponent(viaje.categoria)}&location=${encodeURIComponent(viaje.ubicacion)}&activities=${encodeURIComponent(activities)}&fechasDisponibles=${encodeURIComponent(fechasDisponibles)}" style="text-decoration: none; color: inherit;">
                        ${viaje.titulo}
                    </a>
                </h2>
            </div>
        `;
        carouselList.appendChild(viajeItem);
    });

    // Configurar Swiper
    new Swiper(".swiper", {
        loop: true,
        spaceBetween: 30,
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        autoplay: { delay: 3000, disableOnInteraction: false },
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
}

async function loadGallery() {
    const gallerySection = document.querySelector('.Gallery');
    if (!gallerySection) return;

    try {
        const viajesCollection = collection(db, "viajes");
        const querySnapshot = await getDocs(viajesCollection);
        const viajesArray = querySnapshot.docs.map((doc) => doc.data());

        console.log(viajesArray);


        const filteredTours = viajesArray.filter(viaje => viaje.categoria !== "Descuento" && viaje.categoria !== "Destino");

        const selectedTours = getRandomItems(filteredTours, 7);

        if (selectedTours.length === 0) {
            console.log('No tours selected');
            return;
        }

        gallerySection.innerHTML = ''; 

        selectedTours.forEach((viaje) => {
            const activities = Array.isArray(viaje.actividades) ? viaje.actividades.join(', ') : viaje.actividades ? String(viaje.actividades) : '';
            const fechasDisponibles = viaje.fechasDisponibles ? viaje.fechasDisponibles : '';  

            const eventItem = document.createElement('div');
            eventItem.classList.add('Event', 'searchable');

            eventItem.innerHTML = `
                <img src="${viaje.imagenUrl}" alt="${viaje.titulo}">
                <div class="overlay">
                    <div class="box-galery">
                        <p>From</p>
                        <h4>$${viaje.precio}</h4>
                    </div>
                    <h2 class="location">
                        <a href="/Views/eventDetail.html?title=${encodeURIComponent(viaje.titulo)}&price=${viaje.precio}&image=${encodeURIComponent(viaje.imagenUrl)}&description=${encodeURIComponent(viaje.descripcion)}&category=${encodeURIComponent(viaje.categoria)}&location=${encodeURIComponent(viaje.ubicacion)}&activities=${encodeURIComponent(activities)}&fechasDisponibles=${encodeURIComponent(fechasDisponibles)}" style="text-decoration: none; color: inherit;">
                            ${viaje.titulo}
                        </a>
                    </h2>
                </div>
            `;

            gallerySection.appendChild(eventItem);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

async function loadAllTours(category = "all") {
    const cardsSection = document.querySelector('.cards-section .container');
    if (!cardsSection) return;

    const viajesCollection = collection(db, "viajes");
    const querySnapshot = await getDocs(viajesCollection);
    const viajesArray = querySnapshot.docs.map((doc) => doc.data());

    const filteredTours = viajesArray.filter(viaje => viaje.categoria !== "Destino");

    const finalTours = category === "all" 
        ? filteredTours 
        : filteredTours.filter((viaje) => viaje.categoria === category);

    cardsSection.innerHTML = '';

    finalTours.forEach((viaje) => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('card-item');

        let activities = '';
        if (Array.isArray(viaje.actividades)) {
            activities = encodeURIComponent(viaje.actividades.join(','));
        } else if (viaje.actividades) {
            activities = encodeURIComponent([viaje.actividades].join(','));
        }

        const fechasDisponibles = viaje.fechasDisponibles ? viaje.fechasDisponibles : '';  
        cardItem.innerHTML = `
            <img src="${viaje.imagenUrl}" alt="${viaje.titulo}" class="card-image">
            <div class="overlay">
                <div class="price-box">
                    <p>From</p>
                    <h4>$${viaje.precio}</h4>
                </div>
                <h2 class="location">
                    <a href="/Views/eventDetail.html?title=${encodeURIComponent(viaje.titulo)}&price=${viaje.precio}&image=${encodeURIComponent(viaje.imagenUrl)}&description=${encodeURIComponent(viaje.descripcion)}&category=${encodeURIComponent(viaje.categoria)}&location=${encodeURIComponent(viaje.ubicacion)}&activities=${activities}&fechasDisponibles=${encodeURIComponent(fechasDisponibles)}" style="text-decoration: none; color: inherit;">
                        ${viaje.titulo}
                    </a>
                </h2>
            </div>
        `;

        cardsSection.appendChild(cardItem);
    });
}

async function loadDestinations(category = "Destino") {
    const destinationsSection = document.querySelector('.Destinations');
    if (!destinationsSection) return;

    const viajesCollection = collection(db, "viajes");
    const querySnapshot = await getDocs(viajesCollection);
    const viajesArray = querySnapshot.docs.map((doc) => doc.data());
    const filteredDestinations = viajesArray.filter(viaje => viaje.categoria === category);

    destinationsSection.innerHTML = '';  

    filteredDestinations.forEach((viaje) => {
        // Crear un nuevo div para cada destino
        const destinationItem = document.createElement('div');
        destinationItem.classList.add('Destination');

        destinationItem.innerHTML = `
            <img src="${viaje.imagenUrl}" alt="${viaje.titulo}"> 
            <div class="location-static">${viaje.titulo}</div>
            <div class="overlay">
                <h2 class="location-overlay">${viaje.titulo}</h2>
                <button id="view-tours">View Tours</button>
            </div>
        `;

        // Agregar evento de clic al botón "View Tours"
        const viewToursButton = destinationItem.querySelector('#view-tours');
        viewToursButton.addEventListener('click', () => {
            // Asegurarse de que viaje.actividades sea un array antes de usar join
            let activities = '';
            if (Array.isArray(viaje.actividades)) {
                activities = encodeURIComponent(viaje.actividades.join(','));
            } else if (viaje.actividades && typeof viaje.actividades === 'string') {
                activities = encodeURIComponent([viaje.actividades].join(','));
            }

            const fechasDisponibles = viaje.fechasDisponibles ? viaje.fechasDisponibles : '';

            const url = `/Views/eventDetail.html?title=${encodeURIComponent(viaje.titulo)}&price=${viaje.precio}&image=${encodeURIComponent(viaje.imagenUrl)}&description=${encodeURIComponent(viaje.descripcion)}&category=${encodeURIComponent(viaje.categoria)}&location=${encodeURIComponent(viaje.ubicacion)}&activities=${activities}&fechasDisponibles=${encodeURIComponent(fechasDisponibles)}`;

            // Redirigir al usuario a la nueva URL
            window.location.href = url;
        });

        destinationsSection.appendChild(destinationItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const galleryExists = document.querySelector('.Gallery');
    const carouselExists = document.querySelector('.swiper-wrapper');
    const cardsSectionExists = document.querySelector('.cards-section .container');
    const destinationsSectionExists = document.querySelector('.Destinations'); 


    if (galleryExists || carouselExists) {
        loadTours();
        loadGallery();
    }

    if (cardsSectionExists) {
        loadAllTours();

        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (event) => {
                const selectedCategory = event.target.value;
                loadAllTours(selectedCategory);
            });
        }
    }
    if (destinationsSectionExists) {
        loadDestinations(); 
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const calendarEl = document.getElementById("calendar");


    const modal = document.getElementById("eventModal");
    const span = document.getElementsByClassName("close")[0];

    async function fetchEvents() {
        const events = [];
        const querySnapshot = await getDocs(collection(db, "eventoLocal"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.fecha) {
                events.push({
                    title: data.titulo,
                    start: data.fecha, 
                    description: data.descripcion, 
                    location: data.ubicacion || null,
                    locationUrl: data.ubicacionUrl || null 
                });
            }
        });
        return events;
    }

    const events = await fetchEvents();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: events,
        eventClick: function (info) {
            const event = info.event;
            const location = event.extendedProps.location;
            const locationUrl = event.extendedProps.locationUrl;

            document.getElementById("eventTitle").innerText = event.title;
            document.getElementById("eventDescription").innerText = event.extendedProps.description;

            let locationText = "";


            if (location && locationUrl) {
                locationText = `<a href="${locationUrl}" target="_blank"><strong>Ubicación</strong></a>`;
            } else if (location) {
                locationText = `<strong>Ubicación:</strong> ${location}`;
            }

            document.getElementById("eventLocation").innerHTML = locationText;

            // Mostrar el modal
            modal.style.display = "block";
        }
    });

    calendar.render();
    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});




function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function generateStars(count) {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
}

async function displayReviews() {
    try {
        if (typeof jQuery === 'undefined') {
            await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
        }
        if (typeof $.fn.slick === 'undefined') {
            await Promise.all([
                loadScript('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js'),
                loadCSS('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css'),
                loadCSS('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css')
            ]);
        }


        const heroContainer = document.querySelector('.hero-container');
        if (!heroContainer) {
            const container = document.createElement('div');
            container.className = 'hero-container';
            const image = document.querySelector('.hero-image');
            image.parentNode.insertBefore(container, image);
            container.appendChild(image);
        }

        let reviewsOverlay = document.querySelector('.reviews-overlay');
        if (!reviewsOverlay) {
            reviewsOverlay = document.createElement('div');
            reviewsOverlay.className = 'reviews-overlay';
            reviewsOverlay.innerHTML = '<div id="reviews-carousel"></div>';
            document.querySelector('.hero-container').appendChild(reviewsOverlay);
        }

        const reviewsCarousel = document.getElementById('reviews-carousel');
        reviewsCarousel.innerHTML = '';
        
        const reviewsRef = collection(db, 'reseñas');
        const snapshot = await getDocs(reviewsRef);
        
        snapshot.forEach(doc => {
            const review = doc.data();
            const slide = document.createElement('div');
            slide.classList.add('review-slide');
            
            slide.innerHTML = `
                <h3>${review.name}</h3>
                <div class="review-stars">${generateStars(review.stars)}</div>
                <p>${review.text}</p>
            `;
            
            reviewsCarousel.appendChild(slide);
        });

        $(reviewsCarousel).slick({
            dots: false,
            infinite: true,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2500,
            arrows: true
        });

    } catch (error) {
        console.error("Error fetching reviews: ", error);
    }
}

function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}


document.addEventListener('DOMContentLoaded', displayReviews);

export function reloadReviews() {
    displayReviews();
}








