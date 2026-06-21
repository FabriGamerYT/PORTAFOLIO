(() => {
  "use strict";

  const STORAGE_KEY = "atajo-android-saved-apps-v1";
  const PACKAGE_RE = /^(?:[a-zA-Z][a-zA-Z0-9_]*\.)+[a-zA-Z][a-zA-Z0-9_]*$/;

  const commonApps = [
    { name: "Google Chrome", packageName: "com.android.chrome", initials: "CH" },
    { name: "WhatsApp", packageName: "com.whatsapp", initials: "WA" },
    { name: "Instagram", packageName: "com.instagram.android", initials: "IG" },
    { name: "Facebook", packageName: "com.facebook.katana", initials: "FB" },
    { name: "YouTube", packageName: "com.google.android.youtube", initials: "YT" },
    { name: "Google", packageName: "com.google.android.googlequicksearchbox", initials: "G" },
    { name: "Play Store", packageName: "com.android.vending", initials: "PS" },
    { name: "Servicios de Google Play", packageName: "com.google.android.gms", initials: "GP" },
    { name: "Android System WebView", packageName: "com.google.android.webview", initials: "WV" }
  ];

  const guides = {
    samsung: {
      developer: ["Ajustes", "Acerca del teléfono", "Información de software", "Pulsa 7 veces «Número de compilación»", "Regresa a Ajustes y abre «Opciones de desarrollador»"],
      apps: ["Ajustes", "Aplicaciones", "Busca y toca la aplicación", "Entra a «Almacenamiento» para borrar datos o caché", "Usa «Desinstalar» o «Desactivar» si aparece"]
    },
    xiaomi: {
      developer: ["Ajustes", "Sobre el teléfono", "Pulsa 7 veces «Versión de MIUI» o «Versión del SO»", "Regresa a Ajustes", "Ajustes adicionales → Opciones de desarrollador"],
      apps: ["Ajustes", "Aplicaciones", "Administrar aplicaciones", "Busca y toca la aplicación", "Elige «Limpiar datos», «Desinstalar» o «Deshabilitar» si está disponible"]
    },
    motorola: {
      developer: ["Configuración", "Acerca del teléfono", "Pulsa 7 veces «Número de compilación»", "Regresa a Sistema", "Opciones para desarrolladores"],
      apps: ["Configuración", "Apps", "Ver todas las apps", "Toca la aplicación", "Abre «Almacenamiento y caché» o usa «Desinstalar/Inhabilitar»"]
    },
    pixel: {
      developer: ["Ajustes", "Información del teléfono", "Pulsa 7 veces «Número de compilación»", "Regresa a Sistema", "Opciones para desarrolladores"],
      apps: ["Ajustes", "Aplicaciones", "Ver todas las aplicaciones", "Selecciona la aplicación", "Usa «Almacenamiento y caché», «Desinstalar» o «Inhabilitar»"]
    },
    huawei: {
      developer: ["Ajustes", "Acerca del teléfono", "Pulsa 7 veces «Número de compilación»", "Regresa a Sistema y actualizaciones", "Opciones del desarrollador"],
      apps: ["Ajustes", "Aplicaciones", "Aplicaciones", "Busca y toca la aplicación", "Abre «Almacenamiento» o utiliza «Desinstalar/Deshabilitar» si aparece"]
    }
  };

  const elements = {
    installButton: document.getElementById("installButton"),
    environmentNotice: document.getElementById("environmentNotice"),
    appForm: document.getElementById("appForm"),
    appName: document.getElementById("appName"),
    packageName: document.getElementById("packageName"),
    formError: document.getElementById("formError"),
    savedApps: document.getElementById("savedApps"),
    savedCount: document.getElementById("savedCount"),
    commonApps: document.getElementById("commonApps"),
    guideContent: document.getElementById("guideContent"),
    fallbackModal: document.getElementById("fallbackModal"),
    fallbackText: document.getElementById("fallbackText"),
    fallbackSteps: document.getElementById("fallbackSteps"),
    closeModal: document.getElementById("closeModal"),
    fallbackGeneralApps: document.getElementById("fallbackGeneralApps"),
    copyPackageButton: document.getElementById("copyPackageButton"),
    toast: document.getElementById("toast")
  };

  let deferredInstallPrompt = null;
  let fallbackPackage = "";
  let toastTimer = null;

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function getFallbackUrl(code, packageName = "") {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("fallback", code);
    if (packageName) url.searchParams.set("package", packageName);
    return url.toString();
  }

  function createIntent(action, options = {}) {
    const fallbackUrl = encodeURIComponent(getFallbackUrl(options.fallback || "generic", options.packageName || ""));
    if (options.scheme && options.data) {
      return `intent:${options.data}#Intent;scheme=${options.scheme};action=${action};S.browser_fallback_url=${fallbackUrl};end`;
    }
    return `intent:#Intent;action=${action};S.browser_fallback_url=${fallbackUrl};end`;
  }

  function launchIntent(uri, message) {
    if (!isAndroid()) {
      showToast("Este acceso directo necesita Android. Consulta la guía manual.");
      document.getElementById("guias").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const link = document.createElement("a");
    link.href = uri;
    link.style.display = "none";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(message || "Intentando abrir Ajustes…");
  }

  function openSetting(type, packageName = "") {
    const intents = {
      developers: createIntent(
        "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
        { fallback: "developers" }
      ),
      apps: createIntent(
        "android.settings.MANAGE_APPLICATIONS_SETTINGS",
        { fallback: "apps" }
      ),
      settings: createIntent(
        "android.settings.SETTINGS",
        { fallback: "settings" }
      )
    };

    if (type === "app-details") {
      if (!PACKAGE_RE.test(packageName)) {
        showToast("El nombre del paquete no tiene un formato válido.");
        return;
      }
      const uri = createIntent(
        "android.settings.APPLICATION_DETAILS_SETTINGS",
        {
          scheme: "package",
          data: packageName,
          packageName,
          fallback: "app-details"
        }
      );
      launchIntent(uri, `Abriendo la ficha de ${packageName}…`);
      return;
    }

    if (intents[type]) {
      launchIntent(intents[type], "Intentando abrir Ajustes…");
    }
  }

  function getSavedApps() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveApps(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function initialsFor(name) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join("") || "AP";
  }

  function renderSavedApps() {
    const apps = getSavedApps();
    elements.savedCount.textContent = String(apps.length);

    if (!apps.length) {
      elements.savedApps.innerHTML = `
        <div class="empty-state">
          Todavía no has guardado aplicaciones. Puedes usar las aplicaciones comunes o agregar el nombre de un paquete.
        </div>`;
      return;
    }

    elements.savedApps.innerHTML = apps.map((app, index) => `
      <article class="app-row">
        <div class="app-avatar">${escapeHtml(initialsFor(app.name))}</div>
        <div class="app-meta">
          <strong>${escapeHtml(app.name)}</strong>
          <small>${escapeHtml(app.packageName)}</small>
        </div>
        <div class="app-actions">
          <button class="icon-button" type="button" data-open-package="${escapeHtml(app.packageName)}" aria-label="Abrir ajustes de ${escapeHtml(app.name)}" title="Abrir ficha">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>
          </button>
          <button class="icon-button danger" type="button" data-remove-app="${index}" aria-label="Eliminar acceso de ${escapeHtml(app.name)}" title="Eliminar acceso">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 12H7.7L7 9Zm2.12 2 .47 8h4.82l.47-8H9.12Z"/></svg>
          </button>
        </div>
      </article>
    `).join("");
  }

  function renderCommonApps() {
    elements.commonApps.innerHTML = commonApps.map(app => `
      <button class="common-app" type="button" data-open-package="${escapeHtml(app.packageName)}">
        <span class="app-avatar">${escapeHtml(app.initials)}</span>
        <span>
          <strong>${escapeHtml(app.name)}</strong>
          <small>${escapeHtml(app.packageName)}</small>
        </span>
      </button>
    `).join("");
  }

  function renderGuide(key) {
    const guide = guides[key] || guides.samsung;
    const list = items => `<ol class="path-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
    elements.guideContent.innerHTML = `
      <article class="guide-block">
        <h3>Activar Opciones de desarrollador</h3>
        ${list(guide.developer)}
      </article>
      <article class="guide-block">
        <h3>Administrar una aplicación</h3>
        ${list(guide.apps)}
      </article>
    `;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 3200);
  }

  function showFallback(code, packageName = "") {
    fallbackPackage = packageName;
    elements.fallbackGeneralApps.hidden = true;
    elements.copyPackageButton.hidden = true;

    const content = {
      developers: {
        text: "El navegador o el fabricante bloqueó la apertura directa. Puedes llegar manualmente siguiendo esta ruta:",
        steps: ["Abre Ajustes", "Entra en Sistema o Acerca del teléfono", "Busca Opciones de desarrollador", "Si no aparece, pulsa 7 veces Número de compilación"]
      },
      apps: {
        text: "No se pudo abrir automáticamente la lista de aplicaciones. Utiliza esta ruta:",
        steps: ["Abre Ajustes", "Entra en Aplicaciones o Apps", "Pulsa Ver todas o Administrar aplicaciones", "Selecciona la aplicación"]
      },
      "app-details": {
        text: `No se pudo abrir directamente la ficha de ${packageName || "la aplicación"}.`,
        steps: ["Copia el paquete si lo necesitas", "Abre Ajustes", "Entra en Aplicaciones", "Busca la app por su nombre y abre Almacenamiento"],
        showGeneral: true,
        showCopy: Boolean(packageName)
      },
      settings: {
        text: "No se pudo abrir la aplicación Ajustes automáticamente.",
        steps: ["Busca el icono de Ajustes en tu teléfono", "Ábrelo manualmente", "Usa el buscador interno para encontrar la opción"]
      },
      generic: {
        text: "Android no encontró una pantalla compatible para este acceso directo.",
        steps: ["Abre Ajustes manualmente", "Utiliza el buscador de Ajustes", "Consulta las guías de esta aplicación"]
      }
    }[code] || null;

    if (!content) return;
    elements.fallbackText.textContent = content.text;
    elements.fallbackSteps.innerHTML = `<ol>${content.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
    elements.fallbackGeneralApps.hidden = !content.showGeneral;
    elements.copyPackageButton.hidden = !content.showCopy;
    elements.fallbackModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeFallback() {
    elements.fallbackModal.hidden = true;
    document.body.style.overflow = "";
    const url = new URL(location.href);
    url.searchParams.delete("fallback");
    url.searchParams.delete("package");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      elements.installButton.hidden = false;
    });

    elements.installButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) {
        showToast("Abre el menú del navegador y elige «Instalar aplicación» o «Añadir a pantalla de inicio».");
        return;
      }
      await deferredInstallPrompt.prompt();
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
      showToast("Atajo Android se instaló correctamente.");
    });
  }

  function setupNavigation() {
    const navLinks = [...document.querySelectorAll(".bottom-nav a")];
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .1, .5] });

    sections.forEach(section => observer.observe(section));
  }

  function setupEvents() {
    document.addEventListener("click", event => {
      const settingButton = event.target.closest("[data-open-setting]");
      if (settingButton) {
        openSetting(settingButton.dataset.openSetting);
        return;
      }

      const packageButton = event.target.closest("[data-open-package]");
      if (packageButton) {
        openSetting("app-details", packageButton.dataset.openPackage);
        return;
      }

      const removeButton = event.target.closest("[data-remove-app]");
      if (removeButton) {
        const apps = getSavedApps();
        apps.splice(Number(removeButton.dataset.removeApp), 1);
        saveApps(apps);
        renderSavedApps();
        showToast("Acceso eliminado.");
      }
    });

    elements.appForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = elements.appName.value.trim();
      const packageName = elements.packageName.value.trim();

      if (!PACKAGE_RE.test(packageName)) {
        elements.formError.textContent = "Escribe un paquete válido, por ejemplo: com.empresa.aplicacion";
        elements.formError.hidden = false;
        elements.packageName.focus();
        return;
      }

      const apps = getSavedApps();
      if (apps.some(app => app.packageName.toLowerCase() === packageName.toLowerCase())) {
        elements.formError.textContent = "Ese paquete ya está guardado.";
        elements.formError.hidden = false;
        return;
      }

      apps.unshift({ name: name || packageName, packageName });
      saveApps(apps.slice(0, 30));
      elements.appForm.reset();
      elements.formError.hidden = true;
      renderSavedApps();
      showToast("Acceso guardado en este dispositivo.");
    });

    document.querySelectorAll(".guide-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".guide-tab").forEach(item => {
          const active = item === tab;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        renderGuide(tab.dataset.guide);
      });
    });

    elements.closeModal.addEventListener("click", closeFallback);
    elements.fallbackModal.addEventListener("click", event => {
      if (event.target === elements.fallbackModal) closeFallback();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !elements.fallbackModal.hidden) closeFallback();
    });
    elements.fallbackGeneralApps.addEventListener("click", () => openSetting("apps"));
    elements.copyPackageButton.addEventListener("click", async () => {
      if (!fallbackPackage) return;
      try {
        await navigator.clipboard.writeText(fallbackPackage);
        showToast("Nombre del paquete copiado.");
      } catch {
        showToast(`Paquete: ${fallbackPackage}`);
      }
    });
  }

  function processUrlActions() {
    const params = new URLSearchParams(location.search);
    const fallback = params.get("fallback");
    const packageName = params.get("package") || "";
    if (fallback) {
      setTimeout(() => showFallback(fallback, packageName), 250);
    }

    const action = params.get("action");
    if (action === "apps") {
      document.getElementById("aplicaciones").scrollIntoView();
    } else if (action === "developers") {
      document.getElementById("inicio").scrollIntoView();
      showToast("Pulsa «Opciones de desarrollador» para abrir Ajustes.");
    }
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch(() => {
          console.warn("No se pudo registrar el service worker.");
        });
      });
    }
  }

  function init() {
    elements.environmentNotice.hidden = isAndroid();
    renderSavedApps();
    renderCommonApps();
    renderGuide("samsung");
    setupInstallPrompt();
    setupNavigation();
    setupEvents();
    processUrlActions();
    registerServiceWorker();
  }

  init();
})();
