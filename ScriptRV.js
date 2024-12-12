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

onSnapshot(collection(db, "reseñas"), (snapshot) => {
  reviewsList.innerHTML = "";

  const reviews = [];
  snapshot.forEach((doc) => {
    const review = doc.data();
    reviews.push(review);
  });

  reviews.sort((a, b) => b.createdAt - a.createdAt);

  const latestReviews = reviews.slice(0, 6);

  latestReviews.forEach((review) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
          <div class="review-stars">${"★".repeat(review.stars)}</div>
      <div class="review-name">${review.name}</div>
      <div class="review-text">${review.text}</div>
    `;
    reviewsList.appendChild(slide);
  });

  new Swiper(".swiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});
