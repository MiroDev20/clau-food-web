const ORDER_TUTORIAL_TRIGGER_SELECTOR = ".hero__modal, [data-order-tutorial-open]";
const ORDER_TUTORIAL_STORAGE_KEY = "clauFoodOrderTutorialHidden";
const ORDER_TUTORIAL_SESSION_KEY = "clauFoodOrderTutorialSeen";

let orderTutorialModal = null;
let orderTutorialLastFocus = null;

function hasStoredOrderTutorialPreference() {
    try {
        return window.localStorage.getItem(ORDER_TUTORIAL_STORAGE_KEY) === "true";
    } catch (error) {
        return false;
    }
}

function markOrderTutorialAsHidden() {
    try {
        window.localStorage.setItem(ORDER_TUTORIAL_STORAGE_KEY, "true");
    } catch (error) {
        // The preference is optional; the tutorial still works without storage.
    }
}

function hasSeenOrderTutorialThisSession() {
    try {
        return window.sessionStorage.getItem(ORDER_TUTORIAL_SESSION_KEY) === "true";
    } catch (error) {
        return true;
    }
}

function markOrderTutorialAsSeenThisSession() {
    try {
        window.sessionStorage.setItem(ORDER_TUTORIAL_SESSION_KEY, "true");
    } catch (error) {
        // Session storage can be unavailable in private contexts.
    }
}

function createOrderTutorialModal() {
    const modal = document.createElement("div");
    modal.className = "order-tutorial is-hidden";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div class="order-tutorial__backdrop" data-order-tutorial-close></div>
        <section class="order-tutorial__dialog" role="dialog" aria-modal="true" aria-labelledby="order-tutorial-title">
            <button class="order-tutorial__close" type="button" aria-label="Cerrar tutorial" data-order-tutorial-close>
                <span aria-hidden="true">&times;</span>
            </button>
            <p class="order-tutorial__eyebrow">Pedido por WhatsApp</p>
            <h2 class="order-tutorial__title" id="order-tutorial-title">&iquest;C&oacute;mo pedir?</h2>
            <ol class="order-tutorial__steps">
                <li class="order-tutorial__step">
                    <span class="order-tutorial__icon" aria-hidden="true">1</span>
                    <span>
                        <strong>Explora el men&uacute;</strong>
                        <small>Encuentra el producto que quieres pedir.</small>
                    </span>
                </li>
                <li class="order-tutorial__step">
                    <span class="order-tutorial__icon" aria-hidden="true">
                        <img src="https://res.cloudinary.com/dakne3w9w/image/upload/v1783379924/camera_bnfm6j.svg" alt="">
                    </span>
                    <span>
                        <strong>Toca la c&aacute;mara</strong>
                        <small>Usa el icono del producto para guardarlo como referencia.</small>
                    </span>
                </li>
                <li class="order-tutorial__step">
                    <span class="order-tutorial__icon" aria-hidden="true">
                        <img src="https://res.cloudinary.com/dakne3w9w/image/upload/v1783380638/arrow-down_hlewcj.svg" alt="">
                    </span>
                    <span>
                        <strong>Ve a contacto</strong>
                        <small>Baja hasta la secci&oacute;n de contacto y toca WhatsApp.</small>
                    </span>
                </li>
                <li class="order-tutorial__step">
                    <span class="order-tutorial__icon order-tutorial__icon--text" aria-hidden="true">Aa</span>
                    <span>
                        <strong>Completa tu pedido</strong>
                        <small>En WhatsApp, reemplaza el mensaje autom&aacute;tico con tus datos y adjunta la imagen.</small>
                    </span>
                </li>
            </ol>
            <label class="order-tutorial__check">
                <input type="checkbox" data-order-tutorial-hide>
                <span>No volver a mostrar</span>
            </label>
            <button class="order-tutorial__primary" type="button" data-order-tutorial-close>Entendido</button>
        </section>
    `;

    document.body.appendChild(modal);
    return modal;
}

function getOrderTutorialFocusableElements() {
    if (!orderTutorialModal) {
        return [];
    }

    return Array.from(orderTutorialModal.querySelectorAll("button, input, a, [tabindex]:not([tabindex='-1'])"))
        .filter((element) => !element.disabled && element.offsetParent !== null);
}

function openOrderTutorial() {
    if (!orderTutorialModal) {
        orderTutorialModal = createOrderTutorialModal();
    }

    orderTutorialLastFocus = document.activeElement;
    orderTutorialModal.classList.remove("is-hidden");
    orderTutorialModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-order-tutorial");
    markOrderTutorialAsSeenThisSession();

    const firstFocusable = getOrderTutorialFocusableElements()[0];

    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function closeOrderTutorial() {
    if (!orderTutorialModal || orderTutorialModal.classList.contains("is-hidden")) {
        return;
    }

    const hideCheckbox = orderTutorialModal.querySelector("[data-order-tutorial-hide]");

    if (hideCheckbox?.checked) {
        markOrderTutorialAsHidden();
    }

    orderTutorialModal.classList.add("is-hidden");
    orderTutorialModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-order-tutorial");

    if (orderTutorialLastFocus && typeof orderTutorialLastFocus.focus === "function") {
        orderTutorialLastFocus.focus();
    }
}

function handleOrderTutorialClick(event) {
    const trigger = event.target.closest(ORDER_TUTORIAL_TRIGGER_SELECTOR);

    if (trigger) {
        event.preventDefault();
        openOrderTutorial();
        return;
    }

    if (event.target.closest("[data-order-tutorial-close]")) {
        closeOrderTutorial();
    }
}

function handleOrderTutorialKeydown(event) {
    if (!orderTutorialModal || orderTutorialModal.classList.contains("is-hidden")) {
        return;
    }

    if (event.key === "Escape") {
        closeOrderTutorial();
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getOrderTutorialFocusableElements();
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (!firstFocusable || !lastFocusable) {
        return;
    }

    if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
    }
}

export function initOrderTutorial() {
    // Track user interaction to avoid interrupting engaged users
    let userHasInteracted = false;

    const markUserInteracted = () => {
        if (!userHasInteracted) {
            userHasInteracted = true;
        }
    };

    // Listen for scroll and click interactions
    document.addEventListener("scroll", markUserInteracted, { once: true, passive: true });
    document.addEventListener("click", markUserInteracted, { once: true, passive: true });

    document.addEventListener("click", handleOrderTutorialClick);
    document.addEventListener("keydown", handleOrderTutorialKeydown);

    // Only auto-open if user hasn't interacted and hasn't seen it before
    if (!hasStoredOrderTutorialPreference() && !hasSeenOrderTutorialThisSession() && !userHasInteracted) {
        window.setTimeout(openOrderTutorial, 350);
    }
}

export function addTutorialBadge() {
    const triggerButton = document.querySelector(".hero__modal");
    if (!triggerButton) return;

    // Don't add badge if already exists
    if (triggerButton.querySelector(".order-tutorial__badge")) return;

    const badge = document.createElement("span");
    badge.className = "order-tutorial__badge";
    badge.textContent = "¡Nuevo!";
    triggerButton.appendChild(badge);
}
