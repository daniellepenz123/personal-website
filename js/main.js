const header = document.querySelector(".site-header");
const navigation = header?.querySelector("nav");

if (header && navigation) {
  const mobileScreen = window.matchMedia("(max-width: 900px)");
  const menuButton = document.createElement("button");

  navigation.id = "main-navigation";

  menuButton.type = "button";
  menuButton.className = "menu-toggle";
  menuButton.textContent = "Menu";
  menuButton.setAttribute("aria-controls", navigation.id);
  menuButton.setAttribute("aria-expanded", "false");

  let menuOpen = false;

  function updateMenu() {
    const isMobile = mobileScreen.matches;

    menuButton.hidden = !isMobile;
    navigation.hidden = isMobile && !menuOpen;

    menuButton.setAttribute(
      "aria-expanded",
      String(isMobile && menuOpen)
    );

    menuButton.textContent = menuOpen ? "Close" : "Menu";
  }

  menuButton.addEventListener("click", () => {
    menuOpen = !menuOpen;
    updateMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      menuOpen = false;
      updateMenu();
      menuButton.focus();
    }
  });

  mobileScreen.addEventListener("change", () => {
    const focusWasInNavigation = navigation.contains(
      document.activeElement
    );

    const focusWasOnButton = document.activeElement === menuButton;

    menuOpen = false;
    updateMenu();

    if (mobileScreen.matches && focusWasInNavigation) {
      menuButton.focus();
    } else if (!mobileScreen.matches && focusWasOnButton) {
      navigation.querySelector("a")?.focus();
    }
  });

  header.insertBefore(menuButton, navigation);
  header.classList.add("has-menu");
  updateMenu();
}

const speakingTopics = document.querySelectorAll(".topic-detail");

speakingTopics.forEach((topic) => {
  topic.addEventListener("toggle", () => {
    if (!topic.open) return;

    speakingTopics.forEach((otherTopic) => {
      if (otherTopic !== topic) {
        otherTopic.open = false;
      }
    });
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const inquiryType = contactForm.querySelector("[name='inquiry_type']");
  const detailGroups = contactForm.querySelectorAll("[data-inquiry-type]");
  const submitButton = contactForm.querySelector("[type='submit']");
  const status = contactForm.querySelector(".contact-form-status");
  const statusMessage = status.querySelector(".contact-form-status-message");
  let submitting = false;

  function updateSubmissionStatus(state, message) {
    status.dataset.state = state;
    statusMessage.textContent = message;
  }

  function updateInquiryFields() {
    detailGroups.forEach((group) => {
      const active = group.dataset.inquiryType === inquiryType.value;
      group.hidden = !active;
      group.disabled = !active;
    });
  }

  inquiryType.addEventListener("change", updateInquiryFields);
  contactForm.addEventListener("reset", () => {
    window.requestAnimationFrame(updateInquiryFields);
  });
  updateInquiryFields();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !contactForm.reportValidity()) return;

    const payload = Object.fromEntries(new FormData(contactForm));
    submitting = true;
    submitButton.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    updateSubmissionStatus("sending", "Sending your inquiry…");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) throw new Error("Submission failed");

      contactForm.reset();
      updateInquiryFields();
      updateSubmissionStatus(
        "success",
        "Thank you. Your inquiry has been sent successfully."
      );
    } catch {
      updateSubmissionStatus(
        "error",
        "Your inquiry could not be sent. Your details are still here. Please try again."
      );
    } finally {
      submitting = false;
      submitButton.disabled = false;
      contactForm.removeAttribute("aria-busy");
    }
  });
}

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const entranceSections = document.querySelectorAll(
  "main > .content-section, " +
  "main > .callout, " +
  "main > .statement, " +
  "main > .leadership-statement, " +
  "main > .portfolio-pending, " +
  ".tech-grid > .tech-card, " +
  ".inquiry-guides > .content-section, " +
  ".hero-portrait, " +
  ".editorial-portrait, " +
  ".advocacy-wave, " +
  ".signal-art, " +
  ".inquiry-card, " +
  ".portfolio-art"
);

const revealedSections = new WeakSet();
let entranceObserver;

function setupEntranceAnimations() {
  entranceObserver?.disconnect();

  entranceSections.forEach((section) => {
    section.classList.remove("section-enter");
  });

  if (
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  entranceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const section = entry.target;

        if (
          !reducedMotion.matches &&
          !section.contains(document.activeElement)
        ) {
          section.classList.add("section-enter");
        }

        revealedSections.add(section);
        entranceObserver.unobserve(section);
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -24px 0px"
    }
  );

  entranceSections.forEach((section) => {
    if (!revealedSections.has(section)) {
      entranceObserver.observe(section);
    }
  });
}

setupEntranceAnimations();

reducedMotion.addEventListener("change", setupEntranceAnimations);

const topFocusTarget = document.querySelector(
  ".site-header .site-name"
);

if (topFocusTarget) {
  const backToTop = document.createElement("button");
  const arrow = document.createElement("span");
  const label = document.createElement("span");

  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.hidden = true;

  arrow.textContent = "↑";
  arrow.setAttribute("aria-hidden", "true");

  label.textContent = "Back to top";

  backToTop.append(arrow, label);
  document.body.append(backToTop);
  document.body.classList.add("has-back-to-top");

  let scrollUpdatePending = false;

  function updateBackToTop() {
    const isFocused = document.activeElement === backToTop;

    backToTop.hidden = window.scrollY < 500 && !isFocused;
    scrollUpdatePending = false;
  }

  function requestScrollUpdate() {
    if (scrollUpdatePending) return;

    scrollUpdatePending = true;
    window.requestAnimationFrame(updateBackToTop);
  }

  backToTop.addEventListener("click", () => {
    topFocusTarget.focus({ preventScroll: true });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth"
    });

    requestScrollUpdate();
  });

  backToTop.addEventListener("blur", requestScrollUpdate);

  window.addEventListener("scroll", requestScrollUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestScrollUpdate);
  window.addEventListener("pageshow", requestScrollUpdate);

  updateBackToTop();
}