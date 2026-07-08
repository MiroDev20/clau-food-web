const MENU_JSON_PATH = "./assets/menu.json";
const MENU_LIST_SELECTOR = ".menu__list";
const NO_MENU_MESSAGE = "No se pudo cargar el menú en este momento.";
const FEATURED_CATEGORIES = ["perros", "salchipapas", "hamburguesas", "asados", "pizzas"];

// Cache configuration
const CACHE_KEY_MENU = "clauFood_menu";
const CACHE_KEY_COMBOS = "clauFood_combos";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_VERSION = "v1";

// Cache functions
export function saveToCache(key, data) {
    try {
        const payload = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            data: data,
        };
        localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
        console.warn("No se pudo guardar en caché:", e);
    }
}

export function getFromCache(key, ttl = CACHE_TTL) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const payload = JSON.parse(raw);

        // Check version compatibility
        if (payload.version !== CACHE_VERSION) {
            localStorage.removeItem(key);
            return null;
        }

        if (Date.now() - payload.timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }

        return payload.data;
    } catch (e) {
        return null;
    }
}

export function clearCache(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.warn("No se pudo limpiar la caché:", e);
    }
}

export { CACHE_KEY_MENU, CACHE_KEY_COMBOS, CACHE_TTL, CACHE_VERSION };

export function formatPrice(value) {
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return `$${value}`;

    // Use toLocaleString for proper thousand separators
    const formatted = num.toLocaleString('es-CO', {
        minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
        maximumFractionDigits: Number.isInteger(num) ? 0 : 2
    });

    return `$${formatted}`;
}

export function normalizeCategory(category) {
    return String(category)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function getCategorySlug(category) {
    const normalized = normalizeCategory(category);

    for (const allowedCategory of FEATURED_CATEGORIES) {
        if (normalized.includes(allowedCategory)) {
            return allowedCategory;
        }
    }

    return normalized.split(" ")[0] || "";
}

export function getOptimizedImageUrl(url, baseWidth = 720) {
    const width = window.innerWidth < 600 ? 400 : baseWidth;
    // Replace w_ parameter in Cloudinary URL
    return url.replace(/w_\d+/, `w_${width}`);
}

export function createMenuItemElement(item, options = {}) {
    const { fetchPriority = "low" } = options;
    const itemNode = document.createElement("li");
    itemNode.className = "product-card menu__item";
    itemNode.dataset.category = getCategorySlug(item.categoria);

    const optimizedUrl = getOptimizedImageUrl(item.ruta);

    // Use data-src for lazy loading instead of src
    itemNode.innerHTML = `
        <img data-src="${optimizedUrl}" alt="${item.nombre}" class="product-card__image lazy-image" width="400" height="300" decoding="async" crossorigin="anonymous" fetchpriority="${fetchPriority}">
        <div class="product-card__body">
            <h3 class="product-card__name">${item.nombre}</h3>
            <p class="product-card__desc">${item.descripcion}</p>
            <div class="product-card__meta">
                <span class="product-card__price">${formatPrice(item.precio)}</span>
                <button class="product-card__snapshot" aria-label="Foto ${item.nombre}">
                    <img src="https://res.cloudinary.com/dakne3w9w/image/upload/v1783379924/camera_bnfm6j.svg" alt="" width="24" height="24">
                </button>
            </div>
        </div>
    `;

    return itemNode;
}

export function renderMenuItems(containerSelector, items, options = {}) {
    const container = document.querySelector(containerSelector);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // Filtrar productos con imagen pendiente (placeholder)
    const PENDING_IMAGE_KEYWORDS = ["proximamente", "proximo", "proximamente", "temporal", "placeholder"];
    const filteredItems = items.filter(item => {
        const ruta = item.ruta?.toLowerCase() || "";
        return !PENDING_IMAGE_KEYWORDS.some(keyword => ruta.includes(keyword));
    });

    if (!Array.isArray(filteredItems) || filteredItems.length === 0) {
        const messageItem = document.createElement("li");
        messageItem.className = "product-card menu__item menu__item--empty";
        messageItem.textContent = NO_MENU_MESSAGE;
        container.appendChild(messageItem);
        return;
    }

    filteredItems.forEach((item, index) => {
        const fetchPriority = index < 2 && options.prioritizeFirst ? "high" : "low";
        container.appendChild(createMenuItemElement(item, { fetchPriority }));
    });
}

export async function fetchMenuData(jsonPath = MENU_JSON_PATH, cacheKey = CACHE_KEY_MENU) {
    // Try to get data from cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        console.log("Usando datos en caché para", cacheKey);
        return cached;
    }

    // If no cache, fetch from server
    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        saveToCache(cacheKey, data);
        return data;
    } catch (error) {
        console.error("Error al cargar", jsonPath, error);
        throw error;
    }
}

// Schema.org JSON-LD generation
export function generateMenuSchema(items, isFullMenu = false) {
    // Group items by category
    const categoryMap = {};

    items.forEach((item) => {
        const category = getCategorySlug(item.categoria);
        if (!categoryMap[category]) {
            categoryMap[category] = [];
        }
        categoryMap[category].push(item);
    });

    // Build hasMenuSection
    const menuSections = [];

    for (const [category, products] of Object.entries(categoryMap)) {
        const menuItems = products.map((item) => ({
            "@type": "MenuItem",
            "name": item.nombre,
            "description": item.descripcion,
            "offers": {
                "@type": "Offer",
                "price": (item.precio / 1000).toFixed(2),
                "priceCurrency": "COP"
            },
            "image": item.ruta
        }));

        // Get category display name
        const categoryNames = {
            perros: "Perros Calientes",
            salchipapas: "Salchipapas",
            hamburguesas: "Hamburguesas",
            asados: "Asados y Picadas",
            pizzas: "Pizzas"
        };

        menuSections.push({
            "@type": "MenuSection",
            "name": categoryNames[category] || category,
            "hasMenuItem": menuItems
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": isFullMenu ? "Menú completo Clau Food" : "Menú destacado Clau Food",
        "description": "Perros, salchipapas, hamburguesas, asados y pizzas. Sabor de barrio.",
        "hasMenuSection": menuSections
    };
}

// Lazy loading with Intersection Observer
export function initLazyLoading() {
    const lazyImages = document.querySelectorAll("img.lazy-image[data-src]");

    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    img.src = src;
                    img.onload = () => {
                        img.classList.remove("lazy-image");
                        img.classList.add("loaded");
                    };
                    img.onerror = () => {
                        img.classList.remove("lazy-image");
                        img.classList.add("loaded");
                    };
                    // Clean up data attribute
                    delete img.dataset.src;
                }

                observer.unobserve(img);
            });
        },
        {
            rootMargin: "100px",
            threshold: 0
        }
    );

    lazyImages.forEach((img) => {
        imageObserver.observe(img);
    });
}

export function injectSchemaScript(schema) {
    // Remove existing schema if any
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
        existing.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

export { MENU_JSON_PATH, MENU_LIST_SELECTOR, NO_MENU_MESSAGE, FEATURED_CATEGORIES };
