// Mobile meni
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// Smooth scroll za interne linkove
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Godina u footeru
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Jednostavno dodavanje recenzije (lokalno na stranici)
const reviewForm = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");

if (reviewForm && reviewsList) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("review-name");
    const textInput = document.getElementById("review-text");

    const name = nameInput.value.trim() || "Anonimni korisnik";
    const text = textInput.value.trim();

    if (!text) {
      alert("Molimo unesite kratak komentar.");
      return;
    }

    const article = document.createElement("article");
    article.className = "review";

    const pText = document.createElement("p");
    pText.className = "review-text";
    pText.textContent = `„${text}”`;

    const pAuthor = document.createElement("p");
    pAuthor.className = "review-author";
    pAuthor.textContent = name;

    article.appendChild(pText);
    article.appendChild(pAuthor);
    reviewsList.prepend(article);

    nameInput.value = "";
    textInput.value = "";
  });
}

