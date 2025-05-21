document.addEventListener("DOMContentLoaded", function () {
  let mm = gsap.matchMedia();

  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  //   // --- GLOBAL FADE
  //   function fade() {
  //     const fadeElements = document.querySelectorAll("[fade]");

  //     gsap.set(fadeElements, { opacity: 0, y: "5em" });

  //     ScrollTrigger.batch("[fade]", {
  //       once: true,
  //       onEnter: batch =>
  //         gsap.to(batch, {
  //           opacity: 1,
  //           y: 0,
  //           duration: 1.2,
  //           ease: "power3.out",
  //           stagger: 0.1,
  //         }),
  //     });
  //   }

  // --- GLOBAL FADE
  function fade() {
    const fadeElements = document.querySelectorAll("[fade]");

    gsap.set(fadeElements, el => ({
      opacity: 0,
      y: el.hasAttribute("no-transform") ? 0 : "5em",
    }));

    ScrollTrigger.batch("[fade]", {
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          opacity: 1,
          y: i => (batch[i].hasAttribute("no-transform") ? 0 : 0),
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
        }),
    });
  }

  // --- PARTNERS SLIDER
  function partnersSlider() {
    const sliderMainEl = document.querySelector(".swiper.partners");
    if (!sliderMainEl) return;

    const sliderMain = new Swiper(sliderMainEl, {
      spaceBetween: 0,
      speed: 600,
      simulateTouch: false,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: ".swiper-arrow.partners-next",
        prevEl: ".swiper-arrow.partners-prev",
      },
    });
  }

  // --- MARQUEE
  function marquee() {
    const marqueeSection = document.querySelectorAll(".c-section.hm-partner");
    if (!marqueeSection) return;

    marqueeSection.forEach(section => {
      const ticker = section.querySelector(".c-marquee");
      const logoList = section.querySelector(".c-marquee-list");
      if (!logoList || !ticker) return;

      const duplicatedList = logoList.cloneNode(true);
      ticker.appendChild(duplicatedList);

      const marqueeDuration = window.innerWidth <= 479 ? 40 : 60;

      const tl = gsap.timeline();
      tl.to([logoList, duplicatedList], {
        xPercent: -100,
        duration: marqueeDuration,
        ease: "linear",
        repeat: -1,
      });
    });
  }

  // --- STATS MARQUEE MOBILE
  function statsMarqueeMobile() {
    const slides = document.querySelectorAll(".swiper-slide.partners");
    if (!slides) return;

    slides.forEach(section => {
      const sliderWrap = section.querySelector(".c-partner-stats-wrap");
      const sliderLists = sliderWrap?.querySelectorAll(".c-partner-stats-list");

      // Prevent duplication if there's already more than one list
      if (!sliderWrap || !sliderLists || sliderLists.length > 1) return;

      const sliderList = sliderLists[0];
      const duplicatedList = sliderList.cloneNode(true);
      sliderWrap.appendChild(duplicatedList);

      const marqueeDuration = 30;

      const tl = gsap.timeline();
      tl.to([sliderList, duplicatedList], {
        xPercent: -100,
        duration: marqueeDuration,
        ease: "linear",
        repeat: -1,
      });
    });
  }

  // --- CAPABILITY ITEMS ACCORDION MOBILE
  function capabilityAccordion() {
    const items = document.querySelectorAll(".c-capab-item");
    let currentOpen = null;

    items.forEach((item, index) => {
      const toggle = item.querySelector(".c-capab-hover-title");
      const bg = item.querySelector(".c-capab-hover-bg");
      const description = item.querySelector(".c-capab-desc");
      const icon = item.querySelector(".c-icon.capab-plus");
      const iconVerticalBar = icon.querySelector(".vertical-bar");
      const iconHozBar = icon.querySelector(".hoz-bar");

      const tl = gsap.timeline({
        paused: true,
        reversed: true, // start in reversed state
        defaults: {
          ease: "power4.inOut",
          duration: 0.6,
        },
      });

      tl.to(bg, { opacity: 1 });
      tl.to(description, { height: "auto" }, "0");
      tl.to(icon, { rotation: 90 }, "0");
      tl.to(iconHozBar, { fill: "transparent" }, "0");
      tl.to(iconVerticalBar, { fill: "white" }, "0");

      toggle.addEventListener("click", function () {
        if (currentOpen && currentOpen !== tl) {
          currentOpen.reverse();
        }

        if (tl.reversed()) {
          tl.play();
          currentOpen = tl;
        } else {
          tl.reverse();
          currentOpen = null;
        }
      });
    });
  }

  function init() {
    partnersSlider();
    marquee();
  }

  init();

  // --------------- MATCHMEDIA (DESKTOP) ---------------
  mm.add("(min-width: 992px)", () => {
    fade();
    return () => {
      //
    };
  });

  // --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
  mm.add("(max-width: 991px)", () => {
    statsMarqueeMobile();
    capabilityAccordion();
    return () => {
      //
    };
  });
});
