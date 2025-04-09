document.addEventListener("DOMContentLoaded", function () {
  // --- COPY LINK BTN
  const copyBtns = document.querySelectorAll("[data-copy-link]");

  copyBtns.forEach(btn => {
    const text = btn.querySelector("[data-copy-text]");

    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      text.innerHTML = "Copied!";

      setTimeout(() => {
        text.innerHTML = "copy link";
      }, 1500);
    });
  });

  // --- READ TIME
  const readTimeText = document.querySelector("[data-time-text]");
  const bodyText = document.querySelector(".text-rich-text");

  if (readTimeText && bodyText) {
    const wordsPerMinute = 200;
    const text = bodyText.textContent || "";
    const wordCount = text.trim().split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    readTimeText.textContent = `${readTimeMinutes}`;
  }
});
