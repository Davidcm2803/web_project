// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAowxVHvpmYoluiKnn_M5NMaku9EqcqPDk",
    authDomain: "web-project-f0c9c.firebaseapp.com",
    projectId: "web-project-f0c9c",
    storageBucket: "web-project-f0c9c.appspot.com",
    messagingSenderId: "1025383417170",
    appId: "1:1025383417170:web:51d30811a47a97ae6a268b",
    measurementId: "G-DG1EX6H6PQ"
};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const adminLoginForm = document.getElementById("sellerlogin");
const adminEmailInput = document.getElementById("Email");
const adminPasswordInput = document.getElementById("Password");
const userDisplayName = document.getElementById("user-display-name");
const logoutButton = document.getElementById("logout-btn");

// Login form handler
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
                    alert("Welcome, Admin!");
                    // Redirect to admin dashboard
                    window.location.href = "/Admin/homeAdmin.html";
                } else {
                    alert("Access denied. This portal is for administrators only.");
                }
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                alert("Invalid email or password. Please try again.");
            });
    });
}

// Handle user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Display user name or email
        if (userDisplayName) {
            userDisplayName.textContent = user.displayName || user.email;
        }
    } else {
        // Avoid redirect loop by checking current page
        if (!window.location.pathname.endsWith("adminLogin.html")) {
            window.location.href = "/Admin/adminLogin.html";
        }
    }
});

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
                window.location.href = "/index.html";
            })
            .catch((error) => {
                console.error("Logout error:", error.message);
                alert("Failed to log out. Please try again.");
            });
    });
}

