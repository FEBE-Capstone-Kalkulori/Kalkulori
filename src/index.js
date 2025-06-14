import "regenerator-runtime";
import "./styles/home.css";
import "./styles/meal-popup.css";
import "./styles/meal-plan.css";
import App from "./scripts/app";
import AuthGuard from "./scripts/utils/auth-guard";

function toggleHeaderFooter() {
  const url = window.location.hash.slice(1);
  const authRoutes = ["/signin", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(url);

  const header = document.querySelector("header");

  if (header) {
    header.style.display = isAuthRoute ? "none" : "block";
  }

  document.body.classList.toggle("auth-page", isAuthRoute);
  document.body.classList.toggle("main-page", !isAuthRoute);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (AuthGuard.isAuthenticated()) {
    const isValidToken = await AuthGuard.verifyToken();

    if (!isValidToken) {
      console.log("Token is invalid, logging out...");
      AuthGuard.logout();
      return;
    }
  }

  if (
    !AuthGuard.isAuthenticated() &&
    !window.location.hash.includes("signin") &&
    !window.location.hash.includes("signup")
  ) {
    window.location.hash = "#/signin";
  }

  toggleHeaderFooter();

  window.addEventListener("hashchange", () => {
    toggleHeaderFooter();
  });

  const app = new App({
    content: document.querySelector("main"),
  });

  app.init();
});
