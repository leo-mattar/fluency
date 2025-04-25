document.addEventListener("DOMContentLoaded", function () {
  // --- ALL BTN DOM PLACEMENT
  const allBtn = document.querySelector("[data-filter-goals-all-btn]");
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
      const clearAllBtn = btn.querySelector("[data-filter-all-btn]");

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

      // --- Master Clear All Button Visibility (for whole wrapper)
      const checkboxes = btn.querySelectorAll('input[type="checkbox"]');

      const updateClearAllVisibility = () => {
        const isAnyChecked = Array.from(checkboxes).some(
          checkbox => checkbox.checked
        );
        if (clearAllBtn) {
          clearAllBtn.style.opacity = isAnyChecked ? "1" : "0";
          clearAllBtn.style.pointerEvents = isAnyChecked ? "auto" : "none";
        }
      };

      if (clearAllBtn && checkboxes.length > 0) {
        updateClearAllVisibility();
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener("change", updateClearAllVisibility);
        });
      }

      // --- Individual Group Clear Buttons
      const filterGroups = btn.querySelectorAll(".filters6_filter-group");

      filterGroups.forEach(group => {
        const groupCheckboxes = group.querySelectorAll(
          'input[type="checkbox"]'
        );
        const clearColBtn = group.querySelector("[data-filter-col-btn]"); // Select the clear button within the group

        const updateGroupClearBtn = () => {
          const isAnyChecked = Array.from(groupCheckboxes).some(
            cb => cb.checked
          );
          if (clearColBtn) {
            clearColBtn.style.opacity = isAnyChecked ? "1" : "0";
            clearColBtn.style.pointerEvents = isAnyChecked ? "auto" : "none";
          }
        };

        if (clearColBtn && groupCheckboxes.length > 0) {
          updateGroupClearBtn();
          groupCheckboxes.forEach(cb => {
            cb.addEventListener("change", updateGroupClearBtn);
          });
        }
      });
    });
  }

  // --- SECTION LINK SCROLL OFFSET
  const navLinks = document.querySelectorAll(
    ".c-rc-nav-link, .c-rc-sub-nav-link"
  );

  function smoothScrollWithOffset(e) {
    e.stopPropagation();
    e.preventDefault();

    const targetId = this.getAttribute("href").split("#")[1];
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    const offset = 120;

    const targetPosition =
      targetSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    return false;
  }

  navLinks.forEach(link => {
    link.addEventListener("click", smoothScrollWithOffset, true);
  });

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

  // --- FILTER GOALS BY CUSTOM DATE
  function goalsOrderDate() {
    const select = document.querySelector(".c-select-field.goals-order");
    if (!select) return;

    const options = Array.from(select.options);
    const mostRecentOption = options.find(
      opt => opt.text.trim() === "Most Recent"
    );

    if (mostRecentOption) {
      select.value = mostRecentOption.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  setTimeout(() => {
    paginationBtns();
    goalsOrderDate();
  }, 500);
});
