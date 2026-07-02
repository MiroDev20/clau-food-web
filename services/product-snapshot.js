import { downloadProductSnapshot } from "./product-snapshot-renderer.js";
import { showSuccessToast, showErrorToast, showWarningToast } from "./notifications.js";

const SNAPSHOT_BUTTON_SELECTOR = ".product-card__snapshot, .menu__add, .combos__screenshot";
const PRODUCT_CARD_SELECTOR = ".product-card, .menu__item, .combos__card";

async function requestSaveHandle(event) {
    if (!window.isSecureContext || typeof window.showSaveFilePicker !== "function") {
        return null;
    }

    try {
        return await window.showSaveFilePicker({
            suggestedName: "snapshot-clau-food.png",
            types: [{
                description: "Imagen PNG",
                accept: {
                    "image/png": [".png"],
                },
            }],
        });
    } catch (error) {
        if (error?.name === "AbortError") {
            return null;
        }

        console.warn("No se pudo abrir el selector de archivos:", error);
        return null;
    }
}

async function handleSnapshotClick(event) {
    const button = event.target.closest(SNAPSHOT_BUTTON_SELECTOR);

    if (!button) {
        return;
    }

    const card = button.closest(PRODUCT_CARD_SELECTOR);

    if (!card) {
        return;
    }

    button.disabled = true;
    button.setAttribute("aria-busy", "true");

    const saveHandlePromise = requestSaveHandle(event);

    try {
        await downloadProductSnapshot(card, { saveHandlePromise });
        showSuccessToast("✅ Imagen guardada correctamente");
    } catch (error) {
        if (error.message === "CORS_RESTRICTION") {
            showWarningToast("⚠️ Imagen generada sin foto (problemas de permisos)");
        } else {
            showErrorToast("❌ No se pudo generar la imagen");
        }
    } finally {
        button.disabled = false;
        button.removeAttribute("aria-busy");
    }
}

export function initProductSnapshot() {
    document.addEventListener("click", handleSnapshotClick);
}
