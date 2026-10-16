// 1. Mobile navigation menu
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

// 2. Carousel
const slidesEl = document.getElementById("slides");
const slideCount = slidesEl.children.length;
const dotsEl = document.getElementById("dots");
let current = 0;
let timer;

for (let i = 0; i < slideCount; i++) {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Go to slide " + (i + 1));
  dot.addEventListener("click", () => { goTo(i); restartTimer(); });
  dotsEl.appendChild(dot);
}

function goTo(index) {
  current = (index + slideCount) % slideCount;
  slidesEl.style.transform = "translateX(-" + current * 100 + "%)";
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === current));
}

function restartTimer() {
  clearInterval(timer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => goTo(current + 1), 5000);
  }
}

document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); restartTimer(); });
document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); restartTimer(); });
goTo(0);
restartTimer();

// 3. Menu filter
const filterButtons = document.querySelectorAll(".filter");
const menuItems = document.querySelectorAll("#menuList li");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const choice = btn.dataset.filter;
    menuItems.forEach((item) => {
      item.hidden = choice !== "all" && item.dataset.cat !== choice;
    });
  });
});

// 4. Reservation form (frontend-only validation)
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const guests = Number(form.guests.value);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.name.classList.toggle("invalid", !name);
  form.email.classList.toggle("invalid", !emailOk);
  form.guests.classList.toggle("invalid", !(guests >= 1 && guests <= 12));

  if (!name || !emailOk || !(guests >= 1 && guests <= 12)) {
    msg.className = "form-msg error";
    msg.textContent = "Please enter your name, a valid email and 1 to 12 guests.";
    return;
  }
  msg.className = "form-msg ok";
  msg.textContent = "Thanks, " + name + "! We have your request for " + guests + ". We will email you shortly.";
  form.reset();
  form.guests.value = 2;
});

// 5. Footer year
document.getElementById("year").textContent = new Date().getFullYear();
