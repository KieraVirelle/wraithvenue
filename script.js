(() => {
  const body = document.body;
  const gate = document.getElementById("age-gate");
  const acceptBtn = gate?.querySelector("[data-age-accept]");
  const declineBtn = gate?.querySelector("[data-age-decline]");
  const storageKey = "wraithAgeVerified";

  const unlockSite = () => {
    gate?.classList.add("hidden");
    gate?.setAttribute("aria-hidden", "true");
    body.classList.remove("gate-locked");
  };

  if (localStorage.getItem(storageKey) === "true") {
    unlockSite();
  }

  acceptBtn?.addEventListener("click", () => {
    localStorage.setItem(storageKey, "true");
    unlockSite();
  });

  declineBtn?.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
})();

document.querySelectorAll("[data-bio-toggle]").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("open");
  });
});

(() => {
  const progress = document.getElementById("scroll-progress");
  const parallaxEls = document.querySelectorAll("[data-parallax]");

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(100, (scrolled / height) * 100) : 0;
    if (progress) {
      progress.style.width = `${pct}%`;
    }

    parallaxEls.forEach((el) => {
      const factor = Number(el.getAttribute("data-parallax-factor")) || 0.2;
      el.style.transform = `translateY(${scrolled * factor * -1}px)`;
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();

// VIP modal
(() => {
  const cards = document.querySelectorAll("[data-vip-card]");
  const modal = document.getElementById("vip-modal");
  const content = modal?.querySelector("[data-vip-modal-content]");
  const panel = document.getElementById("vip-panel");
  if (!modal || !content || !cards.length) return;

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    panel?.classList.remove("blur");
  };

  const openModal = (card) => {
    const clone = card.cloneNode(true);
    content.replaceChildren(clone);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    panel?.classList.add("blur");
  };

  modal.querySelectorAll("[data-vip-close]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("vip-modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });
})();
