import routes from "./routes/routes";
import AuthGuard from "./utils/auth-guard";

class App {
  constructor({ content }) {
    this.content = content;
    this.header = document.querySelector("header");
    this.footer = document.querySelector("footer");
    this.currentRoute = null;
    this.SliderComponent = null;
  }

  toggleHeaderFooter(show = true) {
    if (this.header) {
      this.header.style.display = show ? "block" : "none";
    }

    if (this.footer) {
      this.footer.style.display = show ? "block" : "none";
    }

    document.body.classList.toggle("auth-page", !show);
    document.body.classList.toggle("main-page", show);
  }

  isAuthRoute(url) {
    const authRoutes = ["/signin", "/signup", "/forgot-password"];
    return authRoutes.includes(url);
  }

  isAddMealRoute(url) {
    return url === "/add-meal";
  }

  isHomePage(url) {
    return url === "/home" || url === "/" || url === "";
  }

  async loadSliderModule() {
    if (!this.SliderComponent) {
      try {
        const SliderModule = await import("./pages/slider");
        this.SliderComponent = SliderModule.default;
      } catch (error) {
        console.warn("Could not load slider component:", error);
      }
    }
    return this.SliderComponent;
  }

  async handleSlider(url) {
    const SliderComponent = await this.loadSliderModule();

    if (!SliderComponent) {
      return;
    }

    if (typeof SliderComponent.forceCleanup === "function") {
      SliderComponent.forceCleanup();
    } else if (typeof SliderComponent.cleanup === "function") {
      SliderComponent.cleanup();
    }

    if (this.isHomePage(url)) {
      setTimeout(() => {
        const currentUrl = window.location.hash.slice(1);
        if (
          this.isHomePage(currentUrl) &&
          typeof SliderComponent.init === "function"
        ) {
          SliderComponent.init();
        }
      }, 250);
    }
  }

  async renderPage() {
    let url = window.location.hash.slice(1);

    if (!url) {
      if (!AuthGuard.isAuthenticated()) {
        url = "/signin";
        window.location.hash = "#/signin";
      } else {
        url = "/home";
        window.location.hash = "#/home";
      }
    }

    const protectedRoutes = ["/", "/home", "/profile", "/history", "/add-meal"];
    const authRoutes = ["/signin", "/signup"];

    if (protectedRoutes.includes(url) && !AuthGuard.isAuthenticated()) {
      url = "/signin";
      window.location.hash = "#/signin";
    }

    if (authRoutes.includes(url) && AuthGuard.isAuthenticated()) {
      url = "/home";
      window.location.hash = "#/home";
    }

    if (this.SliderComponent) {
      if (typeof this.SliderComponent.forceCleanup === "function") {
        this.SliderComponent.forceCleanup();
      } else if (typeof this.SliderComponent.cleanup === "function") {
        this.SliderComponent.cleanup();
      }
    }

    this.currentRoute = url;

    // Hide header and footer for auth routes AND add meal route
    const shouldHideHeaderFooter =
      this.isAuthRoute(url) || this.isAddMealRoute(url);
    const showHeaderFooter = !shouldHideHeaderFooter;
    this.toggleHeaderFooter(showHeaderFooter);

    // Special styling for auth routes and add meal route
    if (this.isAuthRoute(url) || this.isAddMealRoute(url)) {
      this.content.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: none !important;
        min-height: 100vh !important;
      `;
    } else {
      this.content.style.cssText = "";
    }

    const page = routes[url] || routes["/signin"];
    this.content.innerHTML = await page.render();
    await page.afterRender();

    await this.handleSlider(url);

    window.scrollTo(0, 0);
  }

  async init() {
    await this.loadSliderModule();

    window.addEventListener("hashchange", () => {
      this.renderPage();
    });

    await this.renderPage();
  }
}

export default App;
