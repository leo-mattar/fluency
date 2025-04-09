document.addEventListener("DOMContentLoaded", function () {
  // --- ALL BTN DOM PLACEMENT
  const allBtn = document.querySelector("[data-filter-all-btn]");
  const filterList = document.querySelector(".c-rc-goals-sidebar-list");

  if (allBtn && filterList) {
    filterList.prepend(allBtn);
  }

  // --- FILTER MODAL
  const btnWrappers = document.querySelectorAll(".filters6_button-wrapper");

  if (btnWrappers.length > 0) {
    btnWrappers.forEach(btn => {
      const triggerBtn = btn.querySelector(".filters6_filters-button");
      const overlay = btn.querySelector(".filters6_filters-modal-background");
      const modal = btn.querySelector(".filters6_filters-modal");
      const closeBtn = btn.querySelector(".filters6_modal-close-button");
      const applyBtn = btn.querySelector(".c-apply-btn");

      if (triggerBtn && overlay && modal && closeBtn && applyBtn) {
        triggerBtn.addEventListener("click", () => {
          overlay.classList.add("is-open");
          modal.classList.add("is-open");
          document.body.classList.add("no-scroll");
        });

        const closeModal = () => {
          overlay.classList.remove("is-open");
          modal.classList.remove("is-open");
          document.body.classList.remove("no-scroll");
        };

        overlay.addEventListener("click", closeModal);
        closeBtn.addEventListener("click", closeModal);
        applyBtn.addEventListener("click", closeModal);

        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            closeModal();
          }
        });
      }
    });
  }

  // --- PAGINATION BTN SCROLL TO SECTION
  function paginationBtns() {
    const paginationBtns = document.querySelectorAll(".c-pagination-btn");

    if (paginationBtns.length > 0) {
      paginationBtns.forEach(btn => {
        btn.addEventListener("click", function () {
          const section = this.closest(".c-section");
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }
  }

  setTimeout(() => {
    paginationBtns();
  }, 500);
});
