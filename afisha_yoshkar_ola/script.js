document.addEventListener("DOMContentLoaded", () => {
  const cards = [...document.querySelectorAll(".event-card")];
  const categories = [...document.querySelectorAll("[data-filter]")];
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");
  const resultCount = document.querySelector("#resultCount");
  const noResults = document.querySelector("#noResults");
  const modal = document.querySelector("#eventModal");

  let activeFilter = "all";
  let activeDay = null;
  let searchText = "";

  function filterEvents() {
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesDay = !activeDay || card.dataset.date.endsWith("-" + String(activeDay).padStart(2, "0"));
      const haystack = (card.dataset.search + " " + card.innerText).toLowerCase();
      const matchesSearch = !searchText || haystack.includes(searchText);
      const show = matchesCategory && matchesDay && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    resultCount.textContent = `Найдено: ${visible}`;
    noResults.hidden = visible !== 0;
  }

  function setFilter(filter) {
    activeFilter = filter;
    categories.forEach(button => button.classList.toggle("active", button.dataset.filter === filter));
    filterEvents();
  }

  categories.forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchText = searchInput.value.trim().toLowerCase();
    filterEvents();
    document.querySelector("#events").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll(".days button[data-day]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".days button").forEach(day => day.classList.remove("selected"));
      button.classList.add("selected");
      activeDay = Number(button.dataset.day);
      filterEvents();
      document.querySelector("#events").scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelector("#resetDate").addEventListener("click", () => {
    activeDay = null;
    document.querySelectorAll(".days button").forEach(day => day.classList.remove("selected"));
    filterEvents();
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector("#modalTitle").textContent = button.dataset.title;
      document.querySelector("#modalDescription").textContent = button.dataset.description;
      document.querySelector("#modalTime").textContent = "📅 " + button.dataset.time;
      document.querySelector("#modalPlace").textContent = "📍 " + button.dataset.place;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  document.querySelector("#modalClose").addEventListener("click", closeModal);
  document.querySelector("#modalOk").addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  filterEvents();
});