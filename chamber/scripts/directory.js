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
  }  function createMemberCard(member) {
    const membershipConfig = window.chamberConfig?.membership;
    const levelConfig = membershipConfig?.getLevelById?.(member.membershipLevel);
      return `
      <div class="card directory-item" data-membership-level="${member.membershipLevel || 0}">
        ${membershipConfig && member.membershipLevel > 0 && levelConfig ? 
          `<div class="membership-badge membership-level-${member.membershipLevel}" 
                aria-label="${levelConfig.name} Member">${levelConfig.name}</div>` : ''}
        <div class="card-image">
          <img loading="lazy" 
               decoding="async" 
               src="${member.image}" 
               alt="${member.name}"
               onerror="this.src='images/placeholder.svg'; this.alt='Image not available';">
        </div>
        <div class="card-content">
          <h3 class="card-title">${member.name}</h3>
          <div class="card-description">
            <p>${member.description}</p>
            ${member.phone ? `<p>Phone: <a href="tel:${member.phone}">${member.phone}</a></p>` : ''}
            ${member.website ? `<p>Website: <a href="${member.website}" target="_blank">${new URL(member.website).hostname}</a></p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  function sortMembers(members, sortBy) {
    const sortingStrategies = {
      'name': (a, b) => a.name.localeCompare(b.name),
      'name-desc': (a, b) => b.name.localeCompare(a.name),
      'membership': (a, b) => (b.membershipLevel || 0) - (a.membershipLevel || 0),
      'membership-desc': (a, b) => (a.membershipLevel || 0) - (b.membershipLevel || 0)
    };

    return sortingStrategies[sortBy] ? 
      [...members].sort(sortingStrategies[sortBy]) : 
      [...members];
  }
  async function displayMembers(sortBy = "name") {
    const directoryList = document.querySelector(".directory-list");
    if (!directoryList) return;

    const members = await fetchMembersData();
    const sortedMembers = sortMembers(members, sortBy);
    
    directoryList.innerHTML = sortedMembers
      .map(member => createMemberCard(member))
      .join('');
  }
  function initDirectory() {
    const membershipConfig = window.chamberConfig?.membership;
    membershipConfig?.initializeDynamicStyles?.();

    displayMembers();

    const sortSelect = document.getElementById("sort-select");
    sortSelect?.addEventListener("change", (e) => displayMembers(e.target.value));

    const gridViewBtn = document.getElementById("grid-view");
    const listViewBtn = document.getElementById("list-view");
    const directoryList = document.querySelector(".directory-list");

    if (gridViewBtn && listViewBtn && directoryList) {
      const toggleView = (viewType, activeBtn, inactiveBtn) => {
        directoryList.classList.remove(viewType === 'grid' ? 'list-view' : 'grid-view');
        directoryList.classList.add(`${viewType}-view`);
        activeBtn.classList.add('active');
        inactiveBtn.classList.remove('active');
        localStorage.setItem("directoryView", viewType);
      };

      gridViewBtn.addEventListener("click", () => 
        toggleView('grid', gridViewBtn, listViewBtn));
      
      listViewBtn.addEventListener("click", () => 
        toggleView('list', listViewBtn, gridViewBtn));

      const savedView = localStorage.getItem("directoryView");
      (savedView === "list" ? listViewBtn : gridViewBtn).click();
    }
  }

  initDirectory();
});
