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

  modal.addEventListener("click", (e) => {
    if (!modal.classList.contains("open")) return;
    closeModal();
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

// Menu slider
(() => {
  const cards = document.querySelectorAll("[data-menu-card]");
  const modal = document.getElementById("menu-modal");
  if (!cards.length || !modal) return;

  const media = modal.querySelector("[data-menu-media]");
  const mediaImg = modal.querySelector("[data-menu-img-el]");
  const title = modal.querySelector("[data-menu-title]");
  const mood = modal.querySelector("[data-menu-mood]");
  const blurb = modal.querySelector("[data-menu-blurb]");
  const closeEls = modal.querySelectorAll("[data-menu-close]");

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  const openModal = (card) => {
    const img = card.getAttribute("data-img") || "";
    const heading = card.getAttribute("data-title") || "";
    const moodText = card.getAttribute("data-mood") || "";
    const blurbText = card.getAttribute("data-blurb") || "";
    if (mediaImg) {
      mediaImg.src = img;
      mediaImg.alt = heading || "Menu item";
    }
    if (title) title.textContent = heading;
    if (mood) mood.textContent = moodText;
    if (blurb) blurb.textContent = blurbText;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  closeEls.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();

// Staff carousel + modal
(() => {
  const carousel = document.querySelector("[data-staff-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-staff-track]");
  const slides = Array.from(track?.querySelectorAll("[data-staff]") || []);
  const prev = carousel.querySelector("[data-staff-prev]");
  const next = carousel.querySelector("[data-staff-next]");
  const dotsWrap = document.querySelector("[data-staff-dots]");

  if (!track || !slides.length || !prev || !next) return;

  slides.forEach((slide) => {
    const name = slide.getAttribute("data-name") || "";
    const role = slide.getAttribute("data-role") || "";
    const img = slide.getAttribute("data-img") || "";
    const parts = img.split("/");
    const file = parts.pop() || "";
    const encodedFile = encodeURIComponent(file);
    const dir = parts.join("/");
    const imgUrl = dir ? `${dir}/${encodedFile}` : encodedFile;
    slide.innerHTML = `
      <div class="staff-slide-img" style="background-image: url('${imgUrl}')"></div>
      <div class="staff-slide-meta">
        <p class="role">${role}</p>
        <h3>${name}</h3>
      </div>
    `;
  });

  let index = 0;
  let autoplay = null;

  const renderDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "staff-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to ${i + 1}`);
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(dot);
    });
  };

  const update = () => {
    const len = slides.length;
    slides.forEach((slide, i) => {
      let offset = i - index;
      if (offset > len / 2) offset -= len;
      if (offset < -len / 2) offset += len;
      const translateX = offset * 200;
      const scale = 1 - Math.min(Math.abs(offset) * 0.12, 0.35);
      const rotate = offset * 4;
      const opacity = Math.max(0, 1 - Math.abs(offset) * 0.25);
      slide.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotate}deg)`;
      slide.style.opacity = opacity;
      slide.style.zIndex = `${len - Math.abs(offset)}`;
      slide.classList.toggle("active", offset === 0);
    });

    if (dotsWrap) {
      const dots = Array.from(dotsWrap.querySelectorAll(".staff-dot"));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }
  };

  const nextSlide = () => {
    index = (index + 1) % slides.length;
    update();
  };

  const prevSlide = () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  };

  const startAuto = () => {
    stopAuto();
    autoplay = setInterval(nextSlide, 3200);
  };

  const stopAuto = () => {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  };

  prev.addEventListener("click", () => {
    prevSlide();
    startAuto();
  });

  next.addEventListener("click", () => {
    nextSlide();
    startAuto();
  });

  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      index = i;
      update();
    });
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  renderDots();
  update();
  startAuto();
})();
