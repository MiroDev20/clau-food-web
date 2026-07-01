import {
    renderMenuItems,
    fetchMenuData,
    MENU_LIST_SELECTOR,
    CACHE_KEY_MENU
} from "./menu-utils.js";

const ITEMS_PER_PAGE = 10;
const MENU_JSON_PATH = "./assets/menu.json";

let allMenuItems = [];
let currentPage = 1;
let totalPages = 1;

function getFilteredItems() {
    const activeFilter = document.querySelector(".menu__filter-button--active");
    const filterValue = activeFilter?.dataset?.menuFilter || "all";

    if (filterValue === "all") {
        return allMenuItems;
    }

    return allMenuItems.filter(item => item.categoria === filterValue);
}

function updatePaginationControls() {
    const prevBtn = document.querySelector(".pagination__prev");
    const nextBtn = document.querySelector(".pagination__next");
    const pageInfo = document.querySelector(".pagination__info");
    const container = document.querySelector(".pagination");

    if (!container || totalPages <= 1) {
        if (container) container.style.display = "none";
        return;
    }

    container.style.display = "flex";

    if (pageInfo) {
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.style.display = currentPage === 1 ? "none" : "inline-block";
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.style.display = currentPage === totalPages ? "none" : "inline-block";
    }
}

function renderCurrentPage() {
    const filteredItems = getFilteredItems();
    totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

    // Ensure current page is valid
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredItems.slice(start, end);

    renderMenuItems(MENU_LIST_SELECTOR, pageItems, { prioritizeFirst: true });
    updatePaginationControls();
}

export function goToPage(page) {
    const filteredItems = getFilteredItems();
    const maxPage = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

    if (page < 1 || page > maxPage) {
        return;
    }

    currentPage = page;
    renderCurrentPage();
}

export function nextPage() {
    goToPage(currentPage + 1);
}

export function prevPage() {
    goToPage(currentPage - 1);
}

// Export for external filter reset
export function resetPagination() {
    currentPage = 1;
    renderCurrentPage();
}

function bindPaginationControls() {
    const prevBtn = document.querySelector(".pagination__prev");
    const nextBtn = document.querySelector(".pagination__next");

    if (prevBtn) {
        prevBtn.addEventListener("click", prevPage);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", nextPage);
    }
}

export async function initMenuLoader() {
    // Bind pagination controls
    bindPaginationControls();

    try {
        const data = await fetchMenuData(MENU_JSON_PATH, CACHE_KEY_MENU);
        allMenuItems = data;
        currentPage = 1;
        renderCurrentPage();
    } catch (error) {
        console.error("No se pudo cargar el JSON del menú:", error);
        renderMenuItems(MENU_LIST_SELECTOR, [], { prioritizeFirst: true });
    }
}