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

const inquiryEmail = "danielle.penz123@gmail.com";

const inquiryTemplates = {
  speaking: {
    subject: "Speaking inquiry",
    body: [
      "Hello Danielle,",
      "",
      "I’m reaching out about a speaking opportunity.",
      "",
      "Name:",
      "Organization:",
      "Event name:",
      "Event or organization website:",
      "Intended audience:",
      "Proposed topic:",
      "Proposed date and time zone:",
      "Format (virtual or in person):",
      "Location, if in person:",
      "Expected length:",
      "Speaker budget:",
      "Recording or publication plans:",
      "",
      "Additional details:",
      "",
      "Thank you,"
    ].join("\r\n")
  },

  interview: {
    subject: "Interview request",
    body: [
      "Hello Danielle,",
      "",
      "I’m reaching out to request an interview.",
      "",
      "Name:",
      "Organization, publication, or podcast:",
      "Website:",
      "Interview topic and purpose:",
      "Intended audience:",
      "Format (written, phone, video, or in person):",
      "Proposed date and time zone:",
      "Expected length:",
      "Deadline:",
      "Recording and publication plans:",
      "",
      "Additional details:",
      "",
      "Thank you,"
    ].join("\r\n")
  },

  collaboration: {
    subject: "Collaboration inquiry",
    body: [
      "Hello Danielle,",
      "",
      "I’m reaching out about a potential collaboration.",
      "",
      "Name:",
      "Organization:",
      "Website:",
      "Project or opportunity:",
      "Purpose of the work:",
      "Proposed role or contribution:",
      "Scope of work:",
      "Timeline:",
      "Available budget:",
      "",
      "Additional details:",
      "",
      "Thank you,"
    ].join("\r\n")
  }
};

const inquiryLinks = document.querySelectorAll("[data-inquiry]");

inquiryLinks.forEach((link) => {
  const inquiryType = link.dataset.inquiry;

  if (!Object.hasOwn(inquiryTemplates, inquiryType)) return;

  const template = inquiryTemplates[inquiryType];
  const subject = encodeURIComponent(template.subject);
  const body = encodeURIComponent(template.body);

  link.href = `mailto:${inquiryEmail}?subject=${subject}&body=${body}`;
});

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