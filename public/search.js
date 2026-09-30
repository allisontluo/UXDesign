// GitHub Pages serves static files; handle this small article search in the browser.
const query = new URLSearchParams(window.location.search).get("search") || "";
const normalized = query.trim().replace(/\s+/g, " ").toLowerCase();
if (normalized === "italian brainrot") {
  window.location.replace("article.html");
} else if (normalized === "steal a brainrot") {
  window.location.replace("steal-a-brainrot.html");
} else if (normalized) {
  document.getElementById("search-status").textContent = "No matching article";
  document.getElementById("local-search").value = query;
}
