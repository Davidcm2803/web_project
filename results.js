document.addEventListener("DOMContentLoaded", () => {
    const searchQuery = localStorage.getItem("searchQuery");
    const resultsContainer = document.getElementById("resultsContainer");

    if (searchQuery) {
        const pages = [
            { url: "contacts.html", content: "Información de contacto, teléfono, correo, dirección" },
            { url: "destinations.html", content: "Lugares turísticos, destinos recomendados" },
            { url: "tours.html", content: "Tours, actividades, excursiones" }
        ];

        const matchingPages = pages.filter(page =>
            page.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchingPages.length > 0) {
            resultsContainer.innerHTML = matchingPages.map(page =>
                `<div>
                    <a href="${page.url}">${page.url}</a>
                 </div>`
            ).join('');
        } else {
            resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        }
    } else {
        resultsContainer.innerHTML = "<p>No se proporcionó ningún término de búsqueda.</p>";
    }
});

