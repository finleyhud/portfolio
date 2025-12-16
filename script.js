// Dynamic gallery + filters + lightbox + sidebar toggle

const galleryEl = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxClose = document.getElementById("lightboxClose");
const yearSpan = document.getElementById("year");
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarNavLinks = document.querySelectorAll(".sidebar-nav .nav-link");

let allImages = [];

// Footer year
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Fetch images
fetch("data/images.json")
  .then((res) => res.json())
  .then((data) => {
    allImages = data;
    renderGallery(allImages);
  })
  .catch((err) => {
    console.error("Error loading images.json", err);
    if (galleryEl) {
      galleryEl.innerHTML =
        "<p style='color:#9ca3af;'>Unable to load images right now.</p>";
    }
  });

function renderGallery(images) {
  if (!galleryEl) return;

  if (!images.length) {
    galleryEl.innerHTML =
      "<p style='color:#9ca3af;'>No images yet. Add some to <code>data/images.json</code>.</p>";
    return;
  }

  galleryEl.innerHTML = "";

  images.forEach((img) => {
    const item = document.createElement("article");
    item.className = "gallery-item";
    item.dataset.category = img.category || "";

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.alt || img.title || "Portfolio image";

    const meta = document.createElement("div");
    meta.className = "gallery-item-meta";

    const title = document.createElement("div");
    title.className = "gallery-item-title";
    title.textContent = img.title || "";

    const category = document.createElement("div");
    category.className = "gallery-item-category";
    category.textContent = img.category || "";

    meta.appendChild(title);
    meta.appendChild(category);

    item.appendChild(image);
    item.appendChild(meta);

    item.addEventListener("click", () => openLightbox(img));

    galleryEl.appendChild(item);
  });
}

// Filters
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (filter === "all") {
      renderGallery(allImages);
    } else {
      const filtered = allImages.filter((img) => img.category === filter);
      renderGallery(filtered);
    }
  });
});

// Lightbox
function openLightbox(img) {
  if (!lightbox) return;
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt || img.title || "Portfolio image";
  lightboxTitle.textContent = img.title || "";
  lightboxCategory.textContent = img.category || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// Sidebar toggle (mobile)
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  sidebarNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });
}

// Highlight active nav link while scrolling (basic)
const sections = document.querySelectorAll("section[id]");
const navLinksMap = {};

sidebarNavLinks.forEach((link) => {
  const hash = link.getAttribute("href");
  if (hash && hash.startsWith("#")) {
    navLinksMap[hash.slice(1)] = link;
  }
});

window.addEventListener("scroll", () => {
  let currentId = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = section.id;
    }
  });

  if (!currentId) return;

  sidebarNavLinks.forEach((link) => link.classList.remove("active"));
  const active = navLinksMap[currentId];
  if (active) {
    active.classList.add("active");
  }
});
