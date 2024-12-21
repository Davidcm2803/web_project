import { auth, db } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { updateEmail, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

async function reauthenticateUser(password) {
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credentials);
        console.log("Reautenticación exitosa.");
    } catch (error) {
        console.error("Error al reautenticar: ", error);
        Swal.fire({
            text: "Error al reautenticar. Por favor, asegúrate de ingresar la contraseña correctamente.",
            imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
          });
    }
}

auth.onAuthStateChanged(async (user) => {
    console.log(user);

    if (user) {
        try {
            const displayName = user.displayName || '';
            console.log(displayName);

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email || '',
                    phone: '',
                    destination: '',
                    travelMode: '',
                    budget: '',
                });
                console.log("Documento de usuario creado en Firestore");
            }

            document.getElementById('fullname').value = displayName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('password').placeholder = "No modificar si no deseas cambiar la contraseña";
            const data = (await getDoc(userDocRef)).data();

            document.getElementById('phone').value = data.phone || '';
            document.getElementById('destination').value = data.destination || '';
            document.getElementById('travelMode').value = data.travelMode || '';
            document.getElementById('budget').value = data.budget || '';

            document.getElementById('dropdownUserName').textContent = displayName || 'Usuario';
        } catch (error) {
            console.error("Error al obtener o crear los datos: ", error);
        }
    } else {
        console.log('Usuario no autenticado');
    }
});

document.getElementById('logout').addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('Usuario cerrado sesión');
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

document.querySelector('#btnSave').addEventListener('click', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const destination = document.getElementById('destination').value;
    const travelMode = document.getElementById('travelMode').value;
    const budget = document.getElementById('budget').value;
    const newPassword = document.getElementById('password').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        Swal.fire({
            text: "Por favor ingresa un correo electrónico válido.",
            imageUrl: "/asset/MemeAlerts/wrong-email.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "wrong-email.jpg"
          });
        return;
    }

    if (!fullname || !email || !phone) {
        Swal.fire({
            text: "Los campos obligatorios (Nombre, Email, Teléfono) son requeridos.",
            imageUrl: "/asset/MemeAlerts/peroaqui-nohay-nada.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "peroaqui-nohay-nada.jpg"
          });
        return;
    }

    if (newPassword && newPassword.length < 6) {
        Swal.fire({
            text: "La contraseña debe tener al menos 6 caracteres.",
            imageUrl: "/asset/MemeAlerts/6characters-for-pass.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "6characters-for-pass.jpg"
          });
        return;
    }

    const user = auth.currentUser;

    if (user) {
        try {
            if (newPassword) {
                const password = prompt("Por favor ingresa tu contraseña actual para proceder con el cambio.");
                if (password) {
                    await reauthenticateUser(password);

                    const confirmChange = confirm("¿Estás seguro de que deseas cambiar la contraseña?");
                    if (confirmChange) {
                        if (newPassword.length >= 6) {
                            await updatePassword(user, newPassword);
                            console.log('Contraseña actualizada en Firebase Authentication');
                        } else {
                            Swal.fire({
                                text: "La nueva contraseña debe tener al menos 6 caracteres.",
                                imageUrl: "/asset/MemeAlerts/6characters-for-pass.jpg",
                                imageWidth: 400,
                                imageHeight: 200,
                                imageAlt: "6characters-for-pass.jpg"
                              });
                            return;
                        }
                    } else {
                        return;
                    }
                }
            }

            if (email !== user.email) {
                await updateEmail(user, email);
                console.log('Correo electrónico actualizado en Firebase Authentication');
            }

            if (fullname !== user.displayName) {
                await updateProfile(user, { displayName: fullname });
                console.log('Nombre completo actualizado en Firebase Authentication');
            }

            await setDoc(
                doc(db, 'users', user.uid),
                {
                    phone: phone,
                    destination: destination,
                    travelMode: travelMode,
                    budget: budget,
                },
                { merge: true }
            );

            Swal.fire({
                text: "Información guardada correctamente.",
                imageUrl: "/asset/MemeAlerts/the-success-kid.jpg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "the-success-kid.jpg"
            });
        } catch (error) {
            console.error("Error al guardar los datos: ", error);
            Swal.fire({
                text: "Hubo un error al guardar los datos.",
                imageUrl: "/asset/MemeAlerts/errorrrrrrrrrrrrrrrrrrrrr.jpeg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "errorrrrrrrrrrrrrrrrrrrrr.jpeg"
              });
        }
    } else {
        Swal.fire({
            text: "No estás autenticado. Inicia sesión primero.",
            imageUrl: "/asset/MemeAlerts/por-favor-inicia-sesion.jpeg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "por-favor-inicia-sesion.jpeg"
        });
    }
});
