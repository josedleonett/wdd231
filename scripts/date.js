const currentYear = new Date().getFullYear();
const lastUpdated = document.lastModified;

document.getElementById("current-year").textContent = currentYear;
document.getElementById("last-updated").textContent = lastUpdated;
