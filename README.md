# 🍔 Clau Food — Carta digital interactiva

> Menú visual para pedir perros, salchipapas, hamburguesas, asados y pizzas.  
> Filtros, captura de productos y pedido directo por WhatsApp.

<div align="center">

[![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen)](https://github.com/tu-usuario/clau-food) [![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)](LICENSE)

</div>

---

## ✨ Características principales

- 📱 **Responsive** — Adaptado a móviles, tablets y escritorio.
- 🔍 **Filtrado dinámico** — Navega por categorías: Perros, Salchipapas, Hamburguesas, Asados y Pizzas.
- 📸 **Captura de productos** — Genera una imagen del producto con sus datos (precio, descripción y logo). Útil para compartir o enviar por WhatsApp.
- 📦 **Datos en JSON** — Menú y combos almacenados en archivos JSON fáciles de actualizar sin tocar código.
- 📬 **Tutorial interactivo** — Guía al usuario paso a paso para realizar su primer pedido.
- ⚡ **Rendimiento optimizado** — Lazy loading de imágenes, caché en `localStorage`, bundle único con esbuild.
- ♿ **Accesibilidad** — Contraste mejorado, navegación por teclado y atributos ARIA.
- 🧠 **SEO** — Datos estructurados con Schema.org, `robots.txt` y `sitemap.xml`.

---

## 🖥️ Vista previa

![Captura de pantalla](./assets/preview.png)

---

## 🚀 Tecnologías utilizadas

| Tecnología | Propósito |
|------------|-----------|
| HTML5 + CSS3 | Estructura y estilos |
| JavaScript (ES6+) | Lógica interactiva |
| [esbuild](https://esbuild.github.io/) | Empaquetado y minificación |
| [Cloudinary](https://cloudinary.com/) | Alojamiento y optimización de imágenes |
| LocalStorage + SessionStorage | Caché de datos y preferencias del usuario |
| GitHub Pages (opcional) | Hosting estático |

---

## 📁 Estructura del proyecto

```
clau-food/
├── assets/
│   ├── combos.json          # Datos de combos
│   ├── menu.json            # Datos del menú completo
│   ├── icons/               # Iconos (cámara, WhatsApp)
│   ├── logos/               # Logo de la marca
│   └── productos/           # Imágenes (o vía Cloudinary)
├── services/
│   ├── menu-utils.js        # Utilidades compartidas
│   ├── menu-featured.js     # Destacados en index.html
│   ├── menu-load.js         # Carga completa en menu.html
│   ├── combos-load.js       # Carga de combos
│   ├── menu-filter.js       # Lógica de filtrado
│   ├── product-snapshot.js  # Captura de productos
│   ├── product-snapshot-renderer.js  # Renderizado en canvas
│   ├── order-tutorial.js    # Tutorial interactivo
│   └── header-menu.js       # Menú hamburguesa
├── styles/
│   └── index.css            # Todos los estilos (incluye reset)
├── index.html               # Página principal
├── menu.html                # Menú completo
├── robots.txt               # Configuración para crawlers
├── sitemap.xml              # Mapa del sitio
├── package.json             # Dependencias y scripts
├── .gitignore               # Archivos ignorados
└── README.md                # Este archivo
```

---

## 🛠️ Instalación y uso local

```bash
# 1. Clona el repositorio
git clone https://github.com/MiroDev20/clau-food.git
cd clau-food

# 2. Instala las dependencias (opcional, si usas esbuild)
npm install

# 3. Genera el bundle (opcional)
npm run build

# 4. Abre el proyecto con un servidor local
# Ejemplo con Python 3
python3 -m http.server 8000
# Luego visita http://localhost:8000
```

> **Nota:** El sitio funciona sin `npm run build` porque usa los scripts fuente directamente. El bundle es solo para optimización en producción.

---

## 🧪 Scripts disponibles

En `package.json`:

```json
"scripts": {
  "build": "esbuild services/main.js --bundle --outfile=assets/bundle.js --format=esm --minify"
}
```

Ejecuta `npm run build` para generar el bundle optimizado.

---

## 📦 Datos del menú

Los productos se almacenan en `assets/menu.json`. Cada item tiene:

```json
{
  "id": 1,
  "ruta": "https://res.cloudinary.com/.../imagen.webp",
  "nombre": "Perro sencillo",
  "categoria": "perros",
  "descripcion": "Perro caliente clásico",
  "precio": 6500
}
```

Los combos están en `assets/combos.json` con estructura similar.

---

## 🔧 Personalización

- **Cambiar colores:** edita las variables CSS en `:root` dentro de `styles/index.css`.
- **Añadir categorías:** agrega la categoría en `menu.json` y el botón correspondiente en el HTML.
- **Modificar tutorial:** edita los pasos en `services/order-tutorial.js`.

---

## 🧑‍🤝‍🧑 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar algo:

1. Haz un fork del repositorio.
2. Crea una rama con tu mejora (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "feat: agregar nueva funcionalidad"`).
4. Sube la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 📬 Contacto

- **WhatsApp:** [+57 324 4840556](https://wa.me/+573244840556)
