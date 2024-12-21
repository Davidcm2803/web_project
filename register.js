// Importar Firebase y la configuración de Firebase
import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// DOM elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");
const signupName = document.getElementById("signup-name");
const userIcon = document.getElementById("form-open");
const userDropdown = document.getElementById("userDropdown");
const logoutButton = document.getElementById("logoutButton");
const signupErrorMessage = document.getElementById("signup-error-message");
const modalContainer = document.querySelector(".form_container");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const showSignupFormBtn = document.getElementById("show-signup-form");
const showLoginFormBtn = document.getElementById("show-login-form");

// Función para mostrar/ocultar el modal de inicio de sesión
function toggleModal(show) {
    const homeSection = document.querySelector(".home");
    if (show) {
        homeSection.classList.add("show");
    } else {
        homeSection.classList.remove("show");
    }
}

// Función para actualizar la interfaz de usuario dependiendo del estado de autenticación
function updateUserInterface(user) {
    if (user) {
        userIcon.classList.add("authenticated");
        userDropdown.classList.remove("hidden");
        toggleModal(false);
        document.querySelector(".login-form").classList.add("hidden");
        document.querySelector(".signup_form").classList.add("hidden");
    } else {
        userIcon.classList.remove("authenticated");
        userDropdown.classList.add("hidden");
        toggleModal(true);
        document.querySelector(".login-form").classList.remove("hidden");
        document.querySelector(".signup_form").classList.remove("hidden");
    }
}

// Mouseover para mostrar el dropdown del usuario
userIcon.addEventListener("mouseover", () => {
    if (auth.currentUser) {
        userDropdown.classList.add("visible");
    }
});

userDropdown.addEventListener("mouseover", () => {
    userDropdown.classList.add("visible");
});

userDropdown.addEventListener("mouseout", () => {
    userDropdown.classList.remove("visible");
});

// Cerrar el modal de inicio de sesión
closeLoginBtn.addEventListener("click", () => {
    toggleModal(false);
});

// Mostrar el formulario de registro
showSignupFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".login-form").classList.remove("active");
    document.querySelector(".signup_form").classList.add("active");
});

// Mostrar el formulario de inicio de sesión
showLoginFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".signup_form").classList.remove("active");
    document.querySelector(".login-form").classList.add("active");
});

// Enviar el formulario de inicio de sesión
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user);
            updateUserInterface(user);
            Swal.fire({
                text: "Login successful!",
                imageUrl: "/asset/MemeAlerts/validadndo-datos.jpeg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "validadndo-datos.jpeg"
            });
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            Swal.fire({
                text: "Invalid email or password. Please try again.",
                imageUrl: "/asset/MemeAlerts/incorrect-login.jpeg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "incorrect-login.jpeg"
              });
        });
});

// Enviar el formulario de registro
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;
    const name = signupName.value;

    if (password !== confirmPass) {
        signupErrorMessage.textContent = "Passwords do not match.";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User registered:", user);
            updateUserInterface(user);
            Swal.fire({
                text: `Signup successful! Welcome, ${name}!`,
                imageUrl: "/asset/MemeAlerts/the-success-kid.jpg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "the-success-kid.jpg"
              });
        })
        .catch((error) => {
            console.error("Signup error:", error.message);
            signupErrorMessage.textContent = error.message;
        });
});

// Cerrar sesión
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out.");
            updateUserInterface(null);
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
        });
});

// Cambiar el estado de la autenticación
onAuthStateChanged(auth, (user) => {
    updateUserInterface(user);
    if (user) {
        toggleModal(false);
    } else {
        toggleModal(true);
    }
});





