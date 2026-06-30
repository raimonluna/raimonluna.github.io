// publications.js — loads publications.json and renders the list
// Regenerate publications.json from Inspire-HEP whenever your record changes
// (see /data/README.md for the one-line conversion command).

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("pub-list");
  const searchEl = document.getElementById("pub-search");
  const countEl = document.getElementById("pub-count");

  let allPubs = [];

  fetch("data/publications.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load publications.json");
      return res.json();
    })
    .then((data) => {
      allPubs = data.sort((a, b) => (b.year || 0) - (a.year || 0));
      render(allPubs);
    })
    .catch((err) => {
      listEl.innerHTML = `<li class="pub-empty">Could not load publications right now.<br>(${err.message})</li>`;
    });

  function render(pubs) {
    if (!pubs.length) {
      listEl.innerHTML = `<li class="pub-empty">No publications match that search.</li>`;
      if (countEl) countEl.textContent = "0 results";
      return;
    }
    listEl.innerHTML = pubs
      .map(
        (p) => `
      <li class="pub-item">
        <div class="pub-year mono">${p.year || ""}</div>
        <div>
          <p class="pub-title">${p.title}</p>
          <p class="pub-authors">${formatAuthors(p.authors)}</p>
          <p class="pub-venue">${p.venue || ""}</p>
          <div class="pub-links">
            ${p.arxiv ? `<a href="https://arxiv.org/abs/${p.arxiv}" target="_blank" rel="noopener">arXiv:${p.arxiv}</a>` : ""}
            ${p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>` : ""}
            ${p.inspire ? `<a href="${p.inspire}" target="_blank" rel="noopener">INSPIRE</a>` : ""}
          </div>
        </div>
      </li>`
      )
      .join("");
    if (countEl) countEl.textContent = `${pubs.length} publication${pubs.length === 1 ? "" : "s"}`;
  }

  function formatAuthors(authors) {
    if (!authors) return "";
    return authors
      .map((a) => (a.toLowerCase().includes("luna") ? `<span class="me">${a}</span>` : a))
      .join(", ");
  }

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const q = searchEl.value.trim().toLowerCase();
      if (!q) return render(allPubs);
      const filtered = allPubs.filter((p) => {
        const haystack = `${p.title} ${(p.authors || []).join(" ")} ${p.venue || ""} ${p.year || ""}`.toLowerCase();
        return haystack.includes(q);
      });
      render(filtered);
    });
  }
});
