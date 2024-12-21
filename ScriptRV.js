import { auth, db } from "./firebaseConfig.js";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  const stars = document.getElementById("reviewStars").value;

  if (name && text) {
    try {
      await addDoc(collection(db, "reseñas"), {
        name,
        text,
        stars: parseInt(stars),
      });
      reviewForm.reset();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
});


