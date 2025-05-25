document.addEventListener("DOMContentLoaded", function () {
  async function fetchMembersData() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) {
        throw new Error("Failed to fetch members data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching members data:", error);
      return [];
    }
  }
  function createMemberCard(member) {
    const card = document.createElement("div");
    card.className = "card directory-item";
    card.setAttribute("data-membership-level", member.membershipLevel || 0);

    const membershipConfig = window.chamberConfig?.membership;
    if (
      membershipConfig &&
      member.membershipLevel &&
      member.membershipLevel > 0
    ) {
      const levelConfig = membershipConfig.getLevelById(member.membershipLevel);
      if (levelConfig) {
        const badge = document.createElement("div");
        badge.className = `membership-badge membership-level-${member.membershipLevel}`;
        badge.textContent = levelConfig.name;
        badge.setAttribute("aria-label", `${levelConfig.name} Member`);
        card.appendChild(badge);
      }
    }

    const imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    const img = document.createElement("img");
    // Implement lazy loading for better LCP performance
    img.loading = "lazy";
    img.decoding = "async";
    img.src = member.image;
    img.alt = member.name;
    img.onerror = function () {
      this.src = "images/placeholder.svg";
      this.alt = "Image not available";
    };

    imageDiv.appendChild(img);
    card.appendChild(imageDiv);

    const contentDiv = document.createElement("div");
    contentDiv.className = "card-content";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = member.name;

    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "card-description";

    const description = document.createElement("p");
    description.textContent = member.description;
    descriptionDiv.appendChild(description);

    if (member.phone) {
      const phone = document.createElement("p");
      phone.innerHTML = `Phone: <a href="tel:${member.phone}">${member.phone}</a>`;
      descriptionDiv.appendChild(phone);
    }
    if (member.website) {
      const website = document.createElement("p");
      website.innerHTML = `Website: <a href="${
        member.website
      }" target="_blank">${new URL(member.website).hostname}</a>`;
      descriptionDiv.appendChild(website);
    }

    contentDiv.appendChild(title);
    contentDiv.appendChild(descriptionDiv);

    card.appendChild(contentDiv);

    return card;
  }

  function sortMembers(members, sortBy) {
    const sortedMembers = [...members];

    switch (sortBy) {
      case "name":
        sortedMembers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedMembers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "membership":
        sortedMembers.sort(
          (a, b) => (b.membershipLevel || 0) - (a.membershipLevel || 0)
        );
        break;
      case "membership-desc":
        sortedMembers.sort(
          (a, b) => (a.membershipLevel || 0) - (b.membershipLevel || 0)
        );
        break;
      default:
        break;
    }

    return sortedMembers;
  }

  async function displayMembers(sortBy = "name") {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return;

    directoryList.innerHTML = "";

    const members = await fetchMembersData();

    const sortedMembers = sortMembers(members, sortBy);

    sortedMembers.forEach((member) => {
      const card = createMemberCard(member);
      directoryList.appendChild(card);
    });
  }

  function initDirectory() {
    const membershipConfig = window.chamberConfig?.membership;
    if (
      membershipConfig &&
      typeof membershipConfig.initializeDynamicStyles === "function"
    ) {
      membershipConfig.initializeDynamicStyles();
    }

    displayMembers();

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        displayMembers(this.value);
      });
    }

    const gridViewBtn = document.getElementById("grid-view");
    const listViewBtn = document.getElementById("list-view");
    const directoryList = document.querySelector(".directory-list");

    if (gridViewBtn && listViewBtn && directoryList) {
      gridViewBtn.addEventListener("click", function () {
        directoryList.classList.remove("list-view");
        directoryList.classList.add("grid-view");
        gridViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");

        localStorage.setItem("directoryView", "grid");
      });

      listViewBtn.addEventListener("click", function () {
        directoryList.classList.remove("grid-view");
        directoryList.classList.add("list-view");
        listViewBtn.classList.add("active");
        gridViewBtn.classList.remove("active");

        localStorage.setItem("directoryView", "list");
      });

      const savedView = localStorage.getItem("directoryView");
      if (savedView === "list") {
        listViewBtn.click();
      } else {
        gridViewBtn.click();
      }
    }
  }

  initDirectory();
});
