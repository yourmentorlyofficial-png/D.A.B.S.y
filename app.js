let deferredPrompt = null;


/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("DABSy service worker registered.");
      })
      .catch(error => {
        console.error(
          "Service worker failed:",
          error
        );
      });

  });

}


/* INSTALL */

const installBtn =
  document.getElementById("installBtn");


window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

    installBtn.hidden = false;

  }
);


installBtn.addEventListener(
  "click",
  async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result =
      await deferredPrompt.userChoice;

    console.log(
      "Install result:",
      result.outcome
    );

    deferredPrompt = null;

    installBtn.hidden = true;

  }
);


window.addEventListener(
  "appinstalled",
  () => {

    deferredPrompt = null;

    installBtn.hidden = true;

    showToast(
      "DABSy installed successfully ✦"
    );

  }
);


/* THEME */

const themeBtn =
  document.getElementById("themeBtn");

const savedTheme =
  localStorage.getItem("dabsy-theme");


if (savedTheme) {

  document.documentElement
    .setAttribute(
      "data-theme",
      savedTheme
    );

  updateThemeIcon(savedTheme);

}


themeBtn.addEventListener(
  "click",
  () => {

    const current =
      document.documentElement
        .getAttribute("data-theme");

    const next =
      current === "light"
        ? "dark"
        : "light";

    document.documentElement
      .setAttribute(
        "data-theme",
        next
      );

    localStorage.setItem(
      "dabsy-theme",
      next
    );

    updateThemeIcon(next);

  }
);


function updateThemeIcon(theme) {

  themeBtn.textContent =
    theme === "light"
      ? "☀"
      : "☾";

}


/* QUICK ACTIONS */

document
  .querySelectorAll("[data-action]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const action =
          button.dataset.action;

        showToast(
          `${action} is coming to DABSy V1 ✦`
        );

      }
    );

  });


/* TOAST */

let toastTimer;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);

}
