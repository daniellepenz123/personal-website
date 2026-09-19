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
