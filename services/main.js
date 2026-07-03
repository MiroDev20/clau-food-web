// Importar utilidades
import { fetchMenuData, renderMenuItems, getCategorySlug, generateMenuSchema, injectSchemaScript, initLazyLoading, MENU_JSON_PATH, MENU_LIST_SELECTOR, FEATURED_CATEGORIES } from './menu-utils.js';

// Importar funciones comunes
import { initHeaderMenu } from './header-menu.js';
import { initMenuFilters, getActiveFilter, setFullMenuLoaded } from './menu-filter.js';
import { initOrderTutorial, addTutorialBadge } from './order-tutorial.js';
import { initProductSnapshot } from './product-snapshot.js';
import { loadCombos } from './combos-load.js';

// Importar loaders específicos
import { initFeaturedMenu } from './menu-featured.js';
import { initMenuLoader } from './menu-load.js';

// Detectar página actual
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('menu.html')) return 'menu';
    if (path.includes('index.html') || path === '/' || path === '') return 'index';
    return 'index';
}

// Actualizar enlace "Ver menú completo" con el filtro actual
function updateMenuLink() {
    const menuLink = document.querySelector('.menu__more');
    if (!menuLink) return;

    const currentFilter = getActiveFilter();

    if (currentFilter && currentFilter !== 'all') {
        menuLink.href = `./menu.html?filter=${currentFilter}`;
    } else {
        menuLink.href = './menu.html';
    }
}

// Inicializar scripts comunes (siempre se ejecutan)
function initCommonScripts() {
    initHeaderMenu();
    initMenuFilters();
    initOrderTutorial();
    initProductSnapshot();
}

// Inicializar según la página
function initPageSpecificScripts() {
    const page = getCurrentPage();

    if (page === 'index') {
        // Página de inicio: cargar combos y menú destacado
        loadCombos();
        initFeaturedMenu();

        // Inject menu schema after featured menu loads
        fetchMenuData(MENU_JSON_PATH).then(data => {
            const featured = data.slice(0, 10); // Take a subset for featured
            const schema = generateMenuSchema(featured, false);
            injectSchemaScript(schema);
        }).catch(err => console.warn('Could not generate schema:', err));

        // Añadir badge al botón "¿Cómo pedir?" para fomentar apertura manual
        addTutorialBadge();

        // Actualizar enlace "Ver menú completo" después de que los filtros estén listos
        setTimeout(updateMenuLink, 100);

        // Iniciar lazy loading después de renderizar
        setTimeout(initLazyLoading, 100);
    } else if (page === 'menu') {
        // Página de menú: cargar menú completo
        initMenuLoader();
        setFullMenuLoaded(true);

        // Inject full menu schema after menu loads
        fetchMenuData(MENU_JSON_PATH).then(data => {
            const schema = generateMenuSchema(data, true);
            injectSchemaScript(schema);
        }).catch(err => console.warn('Could not generate schema:', err));

        // Iniciar lazy loading después de renderizar (se ejecutará después de cada renderizado en menu-load.js)
    }
}

// Iniciar todo cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCommonScripts();
        initPageSpecificScripts();
    });
} else {
    initCommonScripts();
    initPageSpecificScripts();
}