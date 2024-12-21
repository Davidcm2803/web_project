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
        alert("Error al reautenticar. Por favor, asegúrate de ingresar la contraseña correctamente.");
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
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    if (!fullname || !email || !phone) {
        alert("Los campos obligatorios (Nombre, Email, Teléfono) son requeridos.");
        return;
    }

    if (newPassword && newPassword.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
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
                            alert("La nueva contraseña debe tener al menos 6 caracteres.");
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

            alert("Información guardada correctamente.");
        } catch (error) {
            console.error("Error al guardar los datos: ", error);
            alert("Hubo un error al guardar los datos.");
        }
    } else {
        alert("No estás autenticado. Inicia sesión primero.");
    }
});
