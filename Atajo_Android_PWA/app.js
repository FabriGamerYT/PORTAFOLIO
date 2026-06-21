(() => {
  "use strict";

  const STORAGE_KEY = "atajo-android-saved-apps-v1";
  const APP_URL = "https://fabrigameryt.github.io/PORTAFOLIO/Atajo_Android_PWA/";
  const LINK_PERMISSION_KEY = "atajo-android-link-permission-v1";
  const INTENT_ATTEMPT_KEY = "atajo-android-intent-attempt-v2";
  const INTENT_ATTEMPT_TTL = 30000;
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
    actionResult: document.getElementById("actionResult"),
    linkPermissionPanel: document.getElementById("linkPermissionPanel"),
    toast: document.getElementById("toast")
  };

  let deferredInstallPrompt = null;
  let toastTimer = null;

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function createAttempt(code, packageName = "") {
    const attempt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      code,
      packageName,
      createdAt: Date.now()
    };

    try {
      sessionStorage.setItem(INTENT_ATTEMPT_KEY, JSON.stringify(attempt));
    } catch {
      // La aplicación sigue funcionando aunque el navegador bloquee sessionStorage.
    }

    return attempt.id;
  }

  function getFallbackUrl(code, packageName = "", attemptId = "") {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("fallback", code);
    if (packageName) url.searchParams.set("package", packageName);
    if (attemptId) url.searchParams.set("attempt", attemptId);
    return url.toString();
  }

  function createIntent(action, options = {}) {
    const fallbackUrl = encodeURIComponent(
      getFallbackUrl(
        options.fallback || "generic",
        options.packageName || "",
        options.attemptId || ""
      )
    );

    if (options.scheme && options.data) {
      return `intent:${options.data}#Intent;scheme=${options.scheme};action=${action};S.browser_fallback_url=${fallbackUrl};end`;
    }

    return `intent:#Intent;action=${action};S.browser_fallback_url=${fallbackUrl};end`;
  }

  function launchIntent(uri, message) {
    const link = document.createElement("a");
    link.href = uri;
    link.style.display = "none";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(message || "Intentando abrir Ajustes…");
  }

  function showDesktopGuide(message) {
    showToast(message || "Este acceso necesita Android. Se abrió la guía manual.");
    document.getElementById("guias").scrollIntoView({ behavior: "smooth" });
  }

  function openSetting(type, packageName = "") {
    if (!isAndroid()) {
      showDesktopGuide("Estás fuera de Android. Consulta la ruta manual.");
      return;
    }

    let action = "";
    let options = {};
    let message = "Intentando abrir Ajustes…";

    if (type === "developers") {
      action = "android.settings.APPLICATION_DEVELOPMENT_SETTINGS";
      options.fallback = "developers";
    } else if (type === "apps") {
      action = "android.settings.MANAGE_APPLICATIONS_SETTINGS";
      options.fallback = "apps";
    } else if (type === "settings") {
      action = "android.settings.SETTINGS";
      options.fallback = "settings";
    } else if (type === "app-details") {
      if (!PACKAGE_RE.test(packageName)) {
        showToast("El nombre del paquete no tiene un formato válido.");
        return;
      }

      action = "android.settings.APPLICATION_DETAILS_SETTINGS";
      options = {
        scheme: "package",
        data: packageName,
        packageName,
        fallback: "app-details"
      };
      message = `Abriendo la ficha de ${packageName}…`;
    } else {
      return;
    }

    options.attemptId = createAttempt(options.fallback, packageName);
    launchIntent(createIntent(action, options), message);
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

  function fallbackContent(code, packageName = "") {
    return {
      developers: {
        title: "Android no abrió Opciones de desarrollador",
        text: "El navegador o el fabricante bloqueó el acceso directo. La aplicación sigue disponible y puedes usar esta ruta manual:",
        steps: ["Abre Ajustes", "Entra en Sistema o Acerca del teléfono", "Busca Opciones de desarrollador", "Si no aparece, pulsa 7 veces Número de compilación"]
      },
      apps: {
        title: "Android no abrió la lista de aplicaciones",
        text: "No se pudo abrir automáticamente, pero puedes llegar desde Ajustes:",
        steps: ["Abre Ajustes", "Entra en Aplicaciones o Apps", "Pulsa Ver todas o Administrar aplicaciones", "Selecciona la aplicación"]
      },
      "app-details": {
        title: "No se pudo abrir esa aplicación",
        text: `Android bloqueó el acceso directo a ${packageName || "la aplicación"}. Puedes copiar el paquete y buscar la aplicación manualmente.`,
        steps: ["Abre Ajustes", "Entra en Aplicaciones", "Busca la aplicación por su nombre", "Abre Almacenamiento para borrar datos o caché"],
        showGeneral: true,
        showCopy: Boolean(packageName)
      },
      settings: {
        title: "Android no abrió Ajustes",
        text: "Abre la aplicación Ajustes manualmente y usa su buscador interno.",
        steps: ["Busca el icono de Ajustes", "Ábrelo", "Escribe el nombre de la opción en el buscador"]
      },
      generic: {
        title: "Acceso no disponible",
        text: "El navegador no encontró una pantalla compatible. Puedes continuar usando las guías de la aplicación.",
        steps: ["Abre Ajustes manualmente", "Usa el buscador de Ajustes", "Consulta la ruta de tu fabricante"]
      }
    }[code] || null;
  }

  function showInlineFallback(code, packageName = "") {
    const content = fallbackContent(code, packageName);
    if (!content || !elements.actionResult) return;

    elements.actionResult.innerHTML = `
      <div class="action-result-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v6h-2V7Zm0 8h2v2h-2v-2Zm1-13a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>
      </div>
      <div class="action-result-content">
        <button class="action-result-close" type="button" data-dismiss-result aria-label="Cerrar aviso">&times;</button>
        <h2>${escapeHtml(content.title)}</h2>
        <p>${escapeHtml(content.text)}</p>
        <ol>${content.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <div class="action-result-actions">
          ${content.showGeneral ? '<button class="button button-primary" type="button" data-result-general-apps>Abrir lista general</button>' : ''}
          ${content.showCopy ? `<button class="button button-secondary" type="button" data-copy-package="${escapeHtml(packageName)}">Copiar paquete</button>` : ''}
          <a class="button button-secondary" href="#guias">Ver guía completa</a>
        </div>
      </div>
    `;

    elements.actionResult.hidden = false;
    setTimeout(() => {
      elements.actionResult.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }

  function hideInlineFallback() {
    if (!elements.actionResult) return;
    elements.actionResult.hidden = true;
    elements.actionResult.innerHTML = "";
  }


  function isStandaloneMode() {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.matchMedia("(display-mode: fullscreen)").matches
      || window.navigator.standalone === true;
  }

  function getLinkPermissionState() {
    try {
      return localStorage.getItem(LINK_PERMISSION_KEY) || "";
    } catch {
      return "";
    }
  }

  function setLinkPermissionState(value) {
    try {
      localStorage.setItem(LINK_PERMISSION_KEY, value);
    } catch {
      // La PWA puede continuar aunque el almacenamiento local esté restringido.
    }
  }

  function showLinkPermissionPanel(force = false) {
    if (!elements.linkPermissionPanel) return;

    const state = getLinkPermissionState();
    if (!force && state) return;

    elements.linkPermissionPanel.classList.remove("accepted");
    elements.linkPermissionPanel.hidden = false;
  }

  function hideLinkPermissionPanel() {
    if (!elements.linkPermissionPanel) return;
    elements.linkPermissionPanel.hidden = true;
  }

  function markLinksAccepted() {
    setLinkPermissionState("accepted");

    if (!elements.linkPermissionPanel) return;

    elements.linkPermissionPanel.classList.add("accepted");
    elements.linkPermissionPanel.innerHTML = `
      <div class="link-permission-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m9 16.17-3.88-3.88-1.41 1.42L9 19 20.29 7.71l-1.41-1.42L9 16.17Z"/></svg>
      </div>
      <div class="link-permission-content">
        <button class="link-permission-close" type="button" data-dismiss-link-permission aria-label="Cerrar">&times;</button>
        <span class="eyebrow">Preferencia guardada</span>
        <h2>Atajo Android está preparado para recibir sus enlaces</h2>
        <p>
          Los enlaces dentro de <strong>${escapeHtml(APP_URL)}</strong> podrán abrirse
          en la PWA cuando Android y el navegador admitan la asociación.
        </p>
        <div class="link-permission-actions">
          <button class="button button-primary" type="button" data-test-app-link>Probar enlace</button>
          <button class="button button-secondary" type="button" data-copy-app-link>Copiar enlace oficial</button>
        </div>
      </div>
    `;

    showToast("Preferencia para abrir enlaces guardada.");
  }

  async function copyOfficialAppUrl() {
    try {
      await navigator.clipboard.writeText(APP_URL);
      showToast("Enlace oficial copiado.");
    } catch {
      showToast(APP_URL);
    }
  }

  function testOfficialAppUrl() {
    const testUrl = `${APP_URL}?source=link-test&time=${Date.now()}`;
    const opened = window.open(testUrl, "_blank", "noopener");

    if (!opened) {
      location.href = testUrl;
    }
  }

  function setupLinkHandlingOnboarding() {
    if (isStandaloneMode() && !getLinkPermissionState()) {
      setTimeout(() => showLinkPermissionPanel(), 450);
    }

    window.matchMedia("(display-mode: standalone)").addEventListener?.("change", event => {
      if (event.matches && !getLinkPermissionState()) {
        showLinkPermissionPanel();
      }
    });
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
      setTimeout(() => showLinkPermissionPanel(true), 350);
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

    document.addEventListener("click", async event => {
      const acceptLinks = event.target.closest("[data-accept-app-links]");
      if (acceptLinks) {
        markLinksAccepted();
        return;
      }

      const dismissLinks = event.target.closest("[data-dismiss-link-permission]");
      if (dismissLinks) {
        setLinkPermissionState("dismissed");
        hideLinkPermissionPanel();
        return;
      }

      const copyAppLink = event.target.closest("[data-copy-app-link]");
      if (copyAppLink) {
        await copyOfficialAppUrl();
        return;
      }

      const testAppLink = event.target.closest("[data-test-app-link]");
      if (testAppLink) {
        testOfficialAppUrl();
        return;
      }

      const dismiss = event.target.closest("[data-dismiss-result]");
      if (dismiss) {
        hideInlineFallback();
        return;
      }

      const generalApps = event.target.closest("[data-result-general-apps]");
      if (generalApps) {
        openSetting("apps");
        return;
      }

      const copyButton = event.target.closest("[data-copy-package]");
      if (copyButton) {
        const packageName = copyButton.dataset.copyPackage || "";
        try {
          await navigator.clipboard.writeText(packageName);
          showToast("Nombre del paquete copiado.");
        } catch {
          showToast(`Paquete: ${packageName}`);
        }
      }
    });
  }

  function readPendingAttempt() {
    try {
      return JSON.parse(sessionStorage.getItem(INTENT_ATTEMPT_KEY) || "null");
    } catch {
      return null;
    }
  }

  function clearPendingAttempt() {
    try {
      sessionStorage.removeItem(INTENT_ATTEMPT_KEY);
    } catch {
      // Sin acción: algunos navegadores pueden bloquear sessionStorage.
    }
  }

  function cleanTemporaryUrlParameters() {
    const url = new URL(location.href);
    ["fallback", "package", "attempt"].forEach(name => url.searchParams.delete(name));
    const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
    history.replaceState({}, "", cleanUrl);
  }

  function processUrlActions() {
    const params = new URLSearchParams(location.search);
    const fallback = params.get("fallback");
    const packageName = params.get("package") || "";
    const attemptId = params.get("attempt") || "";

    if (fallback) {
      const pending = readPendingAttempt();
      const recent = pending && Number.isFinite(pending.createdAt)
        && (Date.now() - pending.createdAt) <= INTENT_ATTEMPT_TTL;
      const matches = recent
        && pending.id === attemptId
        && pending.code === fallback
        && (pending.packageName || "") === packageName;

      // Se limpia antes de mostrar cualquier aviso para evitar que vuelva a
      // aparecer al recargar, abrir un marcador o regresar con el botón Atrás.
      cleanTemporaryUrlParameters();
      clearPendingAttempt();

      if (matches) {
        setTimeout(() => showInlineFallback(fallback, packageName), 180);
      }
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
    setupLinkHandlingOnboarding();
    setupNavigation();
    setupEvents();
    processUrlActions();
    registerServiceWorker();
  }

  init();
})();
