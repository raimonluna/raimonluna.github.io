// site.js — shared behavior across all pages

document.addEventListener("DOMContentLoaded", () => {
  // mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // mark active nav link based on current file name
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
});
