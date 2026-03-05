(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const counters = document.querySelectorAll("[data-counter]");
  const reveals = document.querySelectorAll(".reveal");

  const runCount = (el) => {
    const target = Number(el.textContent);
    const finalValue = Number(el.dataset.counter || target || 0);
    const duration = 1200;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      const value = Math.floor(finalValue * eased);
      el.textContent = String(value);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = String(finalValue);
      }
    };

    requestAnimationFrame(frame);
  };

  let countersStarted = false;

  const observe = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add("show"), delay);
        if (!countersStarted) {
          counters.forEach(runCount);
          countersStarted = true;
        }
        observe.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  if (!prefersReducedMotion.matches) {
    reveals.forEach((item) => observe.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("show"));
    counters.forEach(runCount);
  }

  const year = document.querySelector("footer");
  if (year) {
    const now = new Date().getFullYear();
    year.innerText = year.innerText.replace("2026", String(now));
  }
})();
