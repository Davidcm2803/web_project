document.getElementById("searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const searchQuery = event.target.value.trim();
        if (searchQuery) {
            localStorage.setItem("searchQuery", searchQuery);
            window.location.href = "SearchResults.html";
        } else {
            alert("Por favor, ingresa un término de búsqueda.");
        }
    }
});
