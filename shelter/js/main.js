const burgerIcon = document.querySelector(".burger_icon");
const burgerMenu = document.querySelector(".header_nav");
const navLinks = document.querySelectorAll(".nav_link");
const themeSwitch = document.querySelector(".theme-switch-button");
const overlay = document.querySelector(".overlay");

const sliderTrack = document.querySelector(".slider_track");
const btnPrev = document.querySelector(".slider_btn_prev");
const btnNext = document.querySelector(".slider_btn_next");

const popupWrapper = document.querySelector(".popup");
const popupCloseBtn = document.querySelector(".popup_close_btn");

function closeMenu() {
  if (burgerMenu) burgerMenu.classList.remove("open");
  if (burgerIcon) burgerIcon.classList.remove("open");
  if (overlay && (!popupWrapper || !popupWrapper.classList.contains("open"))) {
    overlay.classList.remove("open");
  }
  document.body.classList.remove("noscroll");
}

function closePopup() {
  if (popupWrapper) popupWrapper.classList.remove("open");
  if (overlay && (!burgerMenu || !burgerMenu.classList.contains("open"))) {
    overlay.classList.remove("open");
  }
  document.body.classList.remove("noscroll");
}

if (burgerIcon) {
  burgerIcon.addEventListener("click", () => {
    if (burgerMenu) burgerMenu.classList.toggle("open");
    burgerIcon.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
    document.body.classList.toggle("noscroll");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    closeMenu();
    closePopup();
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", closePopup);
}

if (popupWrapper) {
  popupWrapper.addEventListener("click", (event) => {
    if (event.target === popupWrapper) {
      closePopup();
    }
  });
}

let allPets = [];
let currentIndex = 0;

function createCard(pet) {
  const card = document.createElement("article");
  card.className = "pet_card";
  card.dataset.name = pet.name;

  card.innerHTML = `
    <img
      src="${pet.img}"
      alt="${pet.name} the ${pet.type}"
      class="pet-card__img"
    >
    <h3 class="card_title">${pet.name}</h3>
    <p class="card_meta">${pet.type} — ${pet.breed} • ${pet.age}</p>
    <p class="card_description">${pet.description}</p>
    <button class="pet_card_btn">Learn more</button>
  `;

  return card;
}

function getStepSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1280) {
    return 360;
  } else if (screenWidth >= 768) {
    return 310;
  } else {
    return 290;
  }
}

function getVisibleCount() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1280) return 3;
  if (screenWidth >= 768) return 2;
  return 1;
}

function updateSlider() {
  if (!sliderTrack) return;
  const step = getStepSize();
  const moveAmount = currentIndex * step;
  sliderTrack.style.transform = `translateX(-${moveAmount}px)`;
}

function initSlider() {
  if (!sliderTrack) return;
  sliderTrack.innerHTML = "";

  allPets.forEach((pet) => {
    const card = createCard(pet);
    sliderTrack.appendChild(card);
  });

  currentIndex = 0;
  updateSlider();
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    const maxIndex = allPets.length - getVisibleCount();
    if (currentIndex >= maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateSlider();
  });
}

if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    const maxIndex = allPets.length - getVisibleCount();
    if (currentIndex <= 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex--;
    }
    updateSlider();
  });
}

window.addEventListener("resize", () => {
  const maxIndex = Math.max(0, allPets.length - getVisibleCount());
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  updateSlider();
});

async function loadPetsData() {
  const response = await fetch("./pets.json");
  allPets = await response.json();
  console.log("Данные внутри функции:", allPets);
  initSlider();
}

loadPetsData();

document.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".pet_card");
  if (!clickedCard) return;

  const petName =
    clickedCard.dataset.name ||
    (clickedCard.querySelector(".card_title") &&
      clickedCard.querySelector(".card_title").innerText.trim());
  if (petName) {
    setupAndOpenPopup(petName);
  }
});

const BASE_PET_PRICE = 25;

function updateModalTotal() {
  const activeSize = document.querySelector(".p_size.active");
  const sizePrice = activeSize ? Number(activeSize.dataset.price) : 0;

  let addonsPrice = 0;
  document.querySelectorAll(".p_addon.active").forEach((btn) => {
    addonsPrice += Number(btn.dataset.price);
  });

  const total = BASE_PET_PRICE + sizePrice + addonsPrice;
  const totalEl = document.getElementById("popup_total");
  if (totalEl) totalEl.textContent = `$${total}.00`;
}

document.querySelectorAll(".p_size").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".p_size").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updateModalTotal();
  });
});

document.querySelectorAll(".p_addon").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    updateModalTotal();
  });
});

function resetModalParams() {
  document.querySelectorAll(".p_size").forEach((btn, index) => {
    btn.classList.toggle("active", index === 0);
  });
  document.querySelectorAll(".p_addon").forEach((btn) => {
    btn.classList.remove("active");
  });
  updateModalTotal();
}

function openPopup() {
  if (popupWrapper) popupWrapper.classList.add("open");
  document.body.classList.add("noscroll");
}

function setupAndOpenPopup(name) {
  const targetPet = allPets.find((pet) => pet.name === name);

  if (targetPet) {
    fillPopupData(targetPet);
    resetModalParams();
    openPopup();
  }
}

function fillPopupData(petObject) {
  const popupImg = document.querySelector(".popup_img");
  const popupTitle = document.querySelector(".popup_title");
  const popupSubtitle = document.querySelector(".popup_subtitle");
  const popupDescription = document.querySelector(".popup_description");

  const popupAge = document.querySelector(".popup_age");
  const popupInoculations = document.querySelector(".popup_inoculations");
  const popupDiseases = document.querySelector(".popup_diseases");
  const popupParasites = document.querySelector(".popup_parasites");

  if (popupImg) {
    popupImg.src = petObject.img;
    popupImg.alt = petObject.name;
  }
  if (popupTitle) popupTitle.innerText = petObject.name;
  if (popupSubtitle)
    popupSubtitle.innerText = `${petObject.type} - ${petObject.breed}`;
  if (popupDescription) popupDescription.innerText = petObject.description;

  if (popupAge) popupAge.innerText = petObject.age;
  if (popupInoculations)
    popupInoculations.innerText = petObject.inoculations.join(", ");
  if (popupDiseases) popupDiseases.innerText = petObject.diseases.join(", ");
  if (popupParasites) popupParasites.innerText = petObject.parasites.join(", ");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (popupWrapper && popupWrapper.classList.contains("open")) {
      closePopup();
    }
    if (burgerMenu && burgerMenu.classList.contains("open")) {
      closeMenu();
    }
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
