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

// Elementos del DOM
const adminLoginForm = document.getElementById("sellerlogin");
const adminEmailInput = document.getElementById("Email");
const adminPasswordInput = document.getElementById("Password");
const userDisplayName = document.getElementById("user-display-name");
const logoutButton = document.getElementById("logout-btn");
const refreshButton = document.getElementById("refreshButton");

// Función de Login
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = adminEmailInput.value;
        const password = adminPasswordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                if (email === "admin@chepeadmin.com") {
                    console.log("Admin logged in:", user);
                    Swal.fire({
                        text: "Welcome, Admin!",
                        imageUrl: "/asset/MemeAlerts/welcome-to-administration.jpg",
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: "welcome-to-administration.jpg"
                    });
                    window.location.href = "/Admin/homeAdmin.html";
                } else {
                    Swal.fire({
                        text: "Access denied. This portal is for administrators only.",
                        imageUrl: "/asset/MemeAlerts/only-admins.jpg",
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: "only-admins.jpg"
                    });
                }
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                Swal.fire({
                    text: "Invalid email or password. Please try again.",
                    imageUrl: "/asset/MemeAlerts/incorrect-login.jpeg",
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: "incorrect-login.jpeg"
                    //try
                });
            });
    });
}

// Verificar estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (userDisplayName) {
            userDisplayName.textContent = user.displayName || user.email;
        }
    } else {
        if (!window.location.pathname.endsWith("adminLogin.html")) {
            window.location.href = "/Admin/adminLogin.html";
        }
    }
});

// Función de Logout
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
                window.location.href = "/index.html";
            })
            .catch((error) => {
                console.error("Logout error:", error.message);
                Swal.fire({
                    text: "Failed to log out. Please try again.",
                    imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
                });
            });
    });
}


