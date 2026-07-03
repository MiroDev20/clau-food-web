import {
    renderMenuItems,
    fetchMenuData,
    getCategorySlug,
    initLazyLoading,
    MENU_JSON_PATH,
    MENU_LIST_SELECTOR,
    FEATURED_CATEGORIES,
    CACHE_KEY_MENU
} from "./menu-utils.js";

function selectFeaturedItems(items) {
    const selected = {};

    FEATURED_CATEGORIES.forEach((category) => {
        selected[category] = [];
    });

    items.forEach((item) => {
        const slug = getCategorySlug(item.categoria);

        if (!FEATURED_CATEGORIES.includes(slug)) {
            return;
        }

        if (selected[slug].length < 2) {
            selected[slug].push(item);
        }
    });

    return FEATURED_CATEGORIES.flatMap((category) => selected[category]);
}

export async function initFeaturedMenu() {
    try {
        const data = await fetchMenuData(MENU_JSON_PATH, CACHE_KEY_MENU);
        const featured = selectFeaturedItems(data);
        renderMenuItems(MENU_LIST_SELECTOR, featured, { prioritizeFirst: true });
        // Re-init lazy loading for featured items
        setTimeout(initLazyLoading, 50);
    } catch (error) {
        console.error("No se pudo cargar el JSON del menú destacado:", error);
        renderMenuItems(MENU_LIST_SELECTOR, [], { prioritizeFirst: true });
    }
}