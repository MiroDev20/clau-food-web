import {
    saveToCache,
    getFromCache,
    getOptimizedImageUrl,
    formatPrice,
    CACHE_KEY_COMBOS
} from "./menu-utils.js";

const COMBOS_JSON_PATH = "./assets/combos.json";
const COMBOS_LIST_SELECTOR = ".combos__list";

function createComboCard(combo, index) {
    const li = document.createElement('li');
    li.className = 'product-card combos__card';

    // First combo gets high priority, others get low
    const fetchPriority = index === 0 ? "high" : "low";
    const optimizedUrl = getOptimizedImageUrl(combo.ruta);

    // Use data-src for lazy loading
    li.innerHTML = `
        <img data-src="${optimizedUrl}" alt="${combo.nombre}" class="product-card__image lazy-image" width="400" height="300" decoding="async" crossorigin="anonymous" fetchpriority="${fetchPriority}">
        <div class="product-card__body">
            <h3 class="product-card__name">${combo.nombre}</h3>
            <p class="product-card__desc">${combo.descripcion}</p>
            <div class="product-card__meta">
                <span class="product-card__price">${formatPrice(combo.precio)}</span>
                <button class="product-card__snapshot" aria-label="Foto ${combo.nombre}"><img src="./assets/icons/camera.svg" alt="" width="24" height="24"></button>
            </div>
        </div>
    `;

    return li;
}

export async function loadCombos() {
    try {
        // Try to get data from cache first
        const cached = getFromCache(CACHE_KEY_COMBOS);
        if (cached) {
            console.log("Usando datos en caché para combos");
            renderCombos(cached);
            return;
        }

        // If no cache, fetch from server
        const res = await fetch(COMBOS_JSON_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const combos = await res.json();

        // Save to cache
        saveToCache(CACHE_KEY_COMBOS, combos);

        renderCombos(combos);
    } catch (err) {
        console.error('No se pudieron cargar los combos:', err);
    }
}

function renderCombos(combos) {
    const list = document.querySelector(COMBOS_LIST_SELECTOR);
    if (!list) return;
    list.innerHTML = '';

    combos.forEach((c, index) => list.appendChild(createComboCard(c, index)));
}