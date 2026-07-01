import { resetPagination } from "./menu-load.js";

export const MENU_FILTER_SELECTOR = "[data-menu-filter]";
const MENU_SECTION_SELECTOR = ".menu";
const MENU_ITEM_SELECTOR = ".menu__item[data-category]";
const ALL_CATEGORIES = "all";

function getFilterValue(filter) {
    return filter.value || filter.dataset.menuFilter || ALL_CATEGORIES;
}

function getMenuFromFilter(filter) {
    return filter.closest(MENU_SECTION_SELECTOR);
}

function getMenuItems(menu) {
    if (!menu) {
        return [];
    }

    return Array.from(menu.querySelectorAll(MENU_ITEM_SELECTOR));
}

function updateActiveFilters(menu, selectedCategory) {
    if (!menu) {
        return;
    }

    menu.querySelectorAll(MENU_FILTER_SELECTOR).forEach((filter) => {
        const isActive = getFilterValue(filter) === selectedCategory;

        if (filter.tagName === "BUTTON") {
            filter.setAttribute("aria-pressed", String(isActive));
            filter.classList.toggle("menu__filter-button--active", isActive);
            return;
        }

        filter.value = selectedCategory;
    });
}

function updateURL(filter) {
    const selectedCategory = getFilterValue(filter);
    const url = new URL(location.href);

    if (selectedCategory === ALL_CATEGORIES) {
        url.searchParams.delete("filter");
    } else {
        url.searchParams.set("filter", selectedCategory);
    }

    history.replaceState({}, "", url);
}

let lastFilterValue = ALL_CATEGORIES;

function updateMenuVisibility(filter) {
    const menu = getMenuFromFilter(filter);
    const selectedCategory = getFilterValue(filter);
    const items = getMenuItems(menu);
    const list = menu?.querySelector(".menu__list");
    const filterChanged = selectedCategory !== lastFilterValue;

    // Add loading class for visual feedback
    if (list) {
        list.classList.add("menu__list--loading");
    }

    // Apply filter after a short delay for smooth transition
    setTimeout(() => {
        // Update active filter buttons
        updateActiveFilters(menu, selectedCategory);

        // Reset pagination when filter changes
        // This triggers re-render in menu-load.js with correct items
        if (filterChanged) {
            lastFilterValue = selectedCategory;
            if (typeof resetPagination === "function") {
                resetPagination();
            }
        }

        // Remove loading class
        if (list) {
            list.classList.remove("menu__list--loading");
        }
    }, 150);
}

function bindMenuFilter(filter) {
    filter.addEventListener("change", () => {
        updateMenuVisibility(filter);
        updateURL(filter);
    });

    filter.addEventListener("click", () => {
        updateMenuVisibility(filter);
        updateURL(filter);
    });
}

function getFilterFromURL() {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");

    // Validate that filter is one of the allowed categories
    const allowedFilters = ["all", "perros", "salchipapas", "hamburguesas", "asados", "pizzas"];
    if (filter && allowedFilters.includes(filter)) {
        return filter;
    }

    return ALL_CATEGORIES;
}

export function getActiveFilter() {
    const menu = document.querySelector(MENU_SECTION_SELECTOR);
    if (!menu) {
        return ALL_CATEGORIES;
    }

    const activeButton = menu.querySelector(".menu__filter-button--active");
    if (activeButton) {
        return getFilterValue(activeButton);
    }

    return ALL_CATEGORIES;
}

export function initMenuFilters() {
    const filters = Array.from(document.querySelectorAll(MENU_FILTER_SELECTOR));
    const urlFilter = getFilterFromURL();

    // Find the button matching the URL filter, or default to "all"
    let activeFilter = filters.find((filter) => getFilterValue(filter) === urlFilter);

    if (!activeFilter) {
        activeFilter = filters.find((filter) => getFilterValue(filter) === ALL_CATEGORIES) || filters[0];
    }

    filters.forEach(bindMenuFilter);

    if (activeFilter) {
        updateMenuVisibility(activeFilter);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenuFilters);
} else {
    initMenuFilters();
}