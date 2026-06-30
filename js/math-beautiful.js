// math-beautiful.js — lightbox behavior for the gallery page
// Detects whether a tile's data-full points to a video (.mp4/.webm/.mov) or an
// image, and renders the right element inside the lightbox accordingly.

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const mediaEl = document.getElementById("lightbox-media");
  const lbEyebrow = document.getElementById("lightbox-eyebrow");
  const lbTitle = document.getElementById("lightbox-title");
  const lbText = document.getElementById("lightbox-text");
  const lbRepo = document.getElementById("lightbox-repo");
  const closeBtn = document.getElementById("lightbox-close");

  const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];

  function isVideo(path) {
    const ext = (path || "").split(".").pop().toLowerCase();
    return VIDEO_EXTENSIONS.includes(ext);
  }

  function openLightbox(tile) {
    const data = tile.dataset;
    const src = data.full || data.thumb;

    mediaEl.innerHTML = "";
    if (isVideo(src)) {
      const video = document.createElement("video");
      video.src = src;
      video.poster = data.thumb || "";
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("aria-label", data.title || "");
      mediaEl.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = data.title || "";
      mediaEl.appendChild(img);
    }

    lbEyebrow.textContent = data.date || "";
    lbTitle.textContent = data.title || "";
    lbText.innerHTML = `<p>${data.p1 || ""}</p><p>${data.p2 || ""}</p>`;
    if (data.repo) {
      lbRepo.href = data.repo;
      lbRepo.style.display = "inline-flex";
    } else {
      lbRepo.style.display = "none";
    }
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    // stop any playing video before clearing it out, otherwise it keeps
    // playing silently in the background
    const video = mediaEl.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    mediaEl.innerHTML = "";
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".mb-tile").forEach((tile) => {
    tile.addEventListener("click", () => openLightbox(tile));
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
});
