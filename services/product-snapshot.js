// ============================================
// NUEVO DISEÑO - SPECS CLARAS
// ============================================
const SNAPSHOT_WIDTH = 1080;
const SNAPSHOT_HEIGHT = 1620;
const SNAPSHOT_PADDING = 48;

// Paleta de colores según especificaciones
const COLORS = {
    cream: "#FFF5E6",
    brown: "#4E2B18",
    brownLight: "#3A2215",
    orange: "#FF6A1A",
    yellow: "#FDCB3A",
    red: "#F6523C",
    green: "#68C442",
    white: "#FFFFFF",
    shadow: "rgba(90,40,15,.12)",
    shadowDark: "rgba(78,43,24,.35)",
    ribbon: "#F6523C",
    whatsApp: "#FDCB3A"
};

// ============================================
// UTILIDADES
// ============================================

function getProductData(card) {
    const image = card.querySelector(".product-card__image, .menu__image, .combos__image");
    const name = card.querySelector(".product-card__name, .menu__name, .combos__name")?.textContent.trim() || image?.alt?.trim() || "Producto";
    const description = card.querySelector(".product-card__desc, .menu__desc, .combos__desc")?.textContent.trim() || "Delicioso plato preparado con los mejores ingredientes";
    const price = card.querySelector(".product-card__price, .menu__price, .combos__price")?.textContent.trim() || "";

    return { image, name, description, price };
}

async function ensureImageIsReady(image) {
    if (!image) return;

    if (!image.src && image.dataset.src) {
        image.src = image.dataset.src;
    }

    if (image.complete && image.naturalWidth > 0) {
        return;
    }

    await new Promise((resolve, reject) => {
        const handleLoad = () => { cleanup(); resolve(); };
        const handleError = () => { cleanup(); reject(new Error("IMAGE_LOAD_FAILED")); };
        const cleanup = () => {
            image.removeEventListener("load", handleLoad);
            image.removeEventListener("error", handleError);
        };

        image.addEventListener("load", handleLoad, { once: true });
        image.addEventListener("error", handleError, { once: true });

        if (image.complete && image.naturalWidth > 0) {
            handleLoad();
        }
    });
}

function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(" ").filter(Boolean);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;
        if (context.measureText(nextLine).width <= maxWidth) {
            currentLine = nextLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);

    lines.slice(0, maxLines).forEach((line, index) => {
        const finalLine = index === maxLines - 1 && lines.length > maxLines ? `${line}...` : line;
        context.fillText(finalLine, x, y + index * lineHeight);
    });
}

// ============================================
// DIBUJOS DE ELEMENTOS
// ============================================

function drawCoveredImage(context, image, x, y, width, height) {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = width / height;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;

    if (imageRatio > targetRatio) {
        sourceWidth = image.naturalHeight * targetRatio;
        sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
        sourceHeight = image.naturalWidth / targetRatio;
        sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    context.save();
    drawRoundedRect(context, x, y, width, height, 20);
    context.clip();
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    context.restore();
}

function drawPlaceholder(context, x, y, width, height) {
    context.save();
    drawRoundedRect(context, x, y, width, height, 20);
    context.clip();

    // Fondo degradado
    const gradient = context.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, "#f5f5f5");
    gradient.addColorStop(1, "#e0e0e0");
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);

    // Icono de plato
    context.fillStyle = COLORS.orange;
    context.beginPath();
    context.arc(x + width / 2, y + height / 2 - 30, 60, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.brown;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(x + width / 2, y + height / 2 - 30, 60, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = COLORS.brown;
    context.font = "700 24px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("IMAGEN", x + width / 2, y + height / 2 + 50);
    context.fillText("NO DISPONIBLE", x + width / 2, y + height / 2 + 85);
    context.textAlign = "left";
    context.restore();
}

function drawDecorations(context, width, height) {
    const orangeWithOpacity = (opacity) => `rgba(255,106,26,${opacity})`;

    // Corazones
    const hearts = [
        { x: 80, y: 180 },
        { x: width - 100, y: 280 },
        { x: 120, y: height - 400 },
        { x: width - 80, y: height - 500 }
    ];

    hearts.forEach(pos => {
        context.fillStyle = orangeWithOpacity(0.7);
        context.font = "32px Arial";
        context.fillText("❤️", pos.x, pos.y);
    });

    // Destellos
    const sparkles = [
        { x: width - 120, y: 180 },
        { x: 100, y: height - 300 },
        { x: width - 150, y: height - 450 }
    ];

    sparkles.forEach(pos => {
        context.fillStyle = orangeWithOpacity(0.7);
        context.font = "28px Arial";
        context.fillText("✨", pos.x, pos.y);
    });

    // Líneas de énfasis
    context.strokeStyle = orangeWithOpacity(0.5);
    context.lineWidth = 3;

    // Líneas cerca del nombre
    context.beginPath();
    context.moveTo(60, 450);
    context.lineTo(120, 450);
    context.stroke();

    context.beginPath();
    context.moveTo(width - 120, 450);
    context.lineTo(width - 60, 450);
    context.stroke();
}

function drawCategoryPill(context, text, x, y) {
    const pillWidth = 200;
    const pillHeight = 44;

    // Fondo amarillo
    context.fillStyle = COLORS.yellow;
    drawRoundedRect(context, x, y, pillWidth, pillHeight, pillHeight / 2);
    context.fill();

    // Borde marrón
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 3;
    drawRoundedRect(context, x, y, pillWidth, pillHeight, pillHeight / 2);
    context.stroke();

    // Texto
    context.fillStyle = COLORS.brown;
    context.font = "700 20px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(text, x + pillWidth / 2, y + 30);
    context.textAlign = "left";
}

function drawPriceTag(context, price, x, y) {
    const tagWidth = 200;
    const tagHeight = 70;

    // Sombra
    context.save();
    context.shadowColor = COLORS.shadow;
    context.shadowBlur = 12;
    context.shadowOffsetY = 6;

    // Fondo blanco
    context.fillStyle = COLORS.white;
    drawRoundedRect(context, x, y, tagWidth, tagHeight, 16);
    context.fill();

    context.restore();

    // Borde marrón
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 4;
    drawRoundedRect(context, x, y, tagWidth, tagHeight, 16);
    context.stroke();

    // Texto precio
    context.fillStyle = COLORS.orange;
    context.font = "700 32px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(price, x + tagWidth / 2, y + 46);
    context.textAlign = "left";

    // Líneas decorativas alrededor
    context.strokeStyle = COLORS.orange;
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(x - 20, y + 20);
    context.lineTo(x - 5, y + 20);
    context.stroke();

    context.beginPath();
    context.moveTo(x + tagWidth + 5, y + 20);
    context.lineTo(x + tagWidth + 20, y + 20);
    context.stroke();

    context.beginPath();
    context.moveTo(x + tagWidth / 2, y + tagHeight + 10);
    context.lineTo(x + tagWidth / 2, y + tagHeight + 25);
    context.stroke();
}

function drawDescriptionBlock(context, description, x, y) {
    // Icono círculo amarillo
    const iconSize = 50;

    context.fillStyle = COLORS.yellow;
    context.beginPath();
    context.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.brown;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
    context.stroke();

    // Icono lápiz (simulado con texto)
    context.fillStyle = COLORS.brown;
    context.font = "700 24px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("✍️", x + iconSize / 2, y + 36);
    context.textAlign = "left";

    // Título DESCRIPCIÓN
    const textX = x + iconSize + 20;

    context.fillStyle = COLORS.brown;
    context.font = "700 22px Arial, sans-serif";
    context.fillText("DESCRIPCIÓN", textX, y + 20);

    // Descripción
    context.fillStyle = COLORS.brown;
    context.font = "400 18px Arial, sans-serif";
    wrapText(context, description, textX, y + 50, 400, 24, 3);
}

function drawDividerLine(context, x, y, width) {
    context.setLineDash([8, 8]);
    context.strokeStyle = COLORS.orange;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.stroke();
    context.setLineDash([]);
}

function drawWhatsAppBox(context, x, y, width, height) {
    // Fondo amarillo
    context.fillStyle = COLORS.whatsApp;
    drawRoundedRect(context, x, y, width, height, 20);
    context.fill();

    // Borde marrón
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 4;
    drawRoundedRect(context, x, y, width, height, 20);
    context.stroke();

    // Sombra
    context.save();
    context.shadowColor = COLORS.shadowDark;
    context.shadowBlur = 0;
    context.shadowOffsetY = 8;
    context.restore();

    // Título
    context.fillStyle = COLORS.brown;
    context.font = "700 28px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("LISTO PARA COMPARTIR", x + width / 2, y + 45);

    // Subtítulo
    context.font = "400 18px Arial, sans-serif";
    context.fillText("Guarda esta imagen y envíala por", x + width / 2, y + 80);
    context.fillText("WhatsApp para hacer tu pedido.", x + width / 2, y + 105);

    // Logo WhatsApp (simulado con emoji grande)
    context.font = "60px Arial";
    context.fillText("📱", x + width / 2 - 30, y + 165);
    context.fillText("💬", x + width / 2 + 30, y + 165);

    context.textAlign = "left";
}

function drawCharacter(context, x, y) {
    // Clau simplificado - medio cuerpo sonriendo
    context.save();

    // Cuerpo/carita base (círculo)
    context.fillStyle = "#FFD4B8"; // piel
    context.beginPath();
    context.arc(x + 60, y + 80, 60, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.brown;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(x + 60, y + 80, 60, 0, Math.PI * 2);
    context.stroke();

    // Cabello
    context.fillStyle = COLORS.brown;
    context.beginPath();
    context.arc(x + 60, y + 45, 40, Math.PI, Math.PI * 2);
    context.fill();

    // Ojos
    context.fillStyle = COLORS.brown;
    context.beginPath();
    context.arc(x + 45, y + 75, 8, 0, Math.PI * 2);
    context.arc(x + 75, y + 75, 8, 0, Math.PI * 2);
    context.fill();

    // Sonrisa
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x + 60, y + 85, 20, 0.2, Math.PI - 0.2);
    context.stroke();

    // Espátula
    context.fillStyle = "#888";
    context.fillRect(x + 95, y + 60, 12, 50);
    context.fillStyle = COLORS.orange;
    context.beginPath();
    context.moveTo(x + 85, y + 60);
    context.lineTo(x + 115, y + 60);
    context.lineTo(x + 110, y + 35);
    context.lineTo(x + 90, y + 35);
    context.closePath();
    context.fill();
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 2;
    context.stroke();

    context.restore();
}

function drawFooter(context, width, height) {
    const footerHeight = 80;
    const footerY = height - footerHeight;

    // Fondo naranja
    context.fillStyle = COLORS.orange;
    context.fillRect(0, footerY, width, footerHeight);

    // Iconos sutiles (hamburguesa, pizza, perro, papas, bebida)
    context.fillStyle = "rgba(255,255,255,0.08)";
    context.font = "24px Arial";

    const icons = ["🍔", "🍕", "🌭", "🍟", "🥤"];
    const spacing = width / (icons.length + 1);

    icons.forEach((icon, i) => {
        context.fillText(icon, spacing * (i + 1) - 12, footerY + 50);
    });

    // Logo manuscrito
    context.fillStyle = COLORS.white;
    context.font = "700 32px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("ClauFood", width / 2, footerY + 52);
    context.textAlign = "left";
}

function drawBasilLeaves(context, x, y) {
    context.save();

    // Hoja 1
    context.fillStyle = COLORS.green;
    context.beginPath();
    context.ellipse(x, y, 25, 12, -0.5, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.brown;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x - 15, y);
    context.lineTo(x + 20, y);
    context.stroke();

    // Hoja 2
    context.fillStyle = COLORS.green;
    context.beginPath();
    context.ellipse(x + 35, y + 20, 20, 10, 0.3, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.brown;
    context.beginPath();
    context.moveTo(x + 20, y + 20);
    context.lineTo(x + 50, y + 20);
    context.stroke();

    // Hoja 3
    context.fillStyle = "#7ED957";
    context.beginPath();
    context.ellipse(x - 15, y + 30, 18, 9, -0.3, 0, Math.PI * 2);
    context.fill();

    context.restore();
}

function drawRibbon(context, x, y, width, height) {
    const ribbonHeight = height;
    const foldSize = 25;

    // Cinta principal
    context.fillStyle = COLORS.ribbon;
    context.beginPath();
    context.moveTo(x, y + foldSize);
    context.lineTo(x + foldSize, y);
    context.lineTo(x + width - foldSize, y);
    context.lineTo(x + width, y + foldSize);
    context.lineTo(x + width, y + ribbonHeight - foldSize);
    context.lineTo(x + width - foldSize, y + ribbonHeight);
    context.lineTo(x + foldSize, y + ribbonHeight);
    context.lineTo(x, y + ribbonHeight - foldSize);
    context.closePath();
    context.fill();

    // Borde
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 3;
    context.stroke();

    // dobleces
    context.fillStyle = "#D43F3F";
    context.beginPath();
    context.moveTo(x, y + foldSize);
    context.lineTo(x + foldSize, y);
    context.lineTo(x + foldSize, y + foldSize);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(x + width - foldSize, y + foldSize);
    context.lineTo(x + width - foldSize, y);
    context.lineTo(x + width, y + foldSize);
    context.closePath();
    context.fill();
    context.stroke();

    // Texto
    context.fillStyle = COLORS.white;
    context.font = "700 18px Arial, sans-serif";
    context.textAlign = "center";

    const lines = ["¡SABORES QUE COMBINAN,", "MOMENTOS QUE SE DISFRUTAN!"];
    lines.forEach((line, i) => {
        context.fillText(line, x + width / 2, y + ribbonHeight / 2 + i * 22 - 5);
    });

    context.textAlign = "left";
}

// ============================================
// CANVAS PRINCIPAL
// ============================================

export function createFileName(productName) {
    const slug = productName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${slug || "producto"}-clau-food.png`;
}

function createCanvasBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("No se pudo generar la imagen."));
            }
        }, "image/png");
    });
}

async function downloadCanvas(canvas, fileName, options = {}) {
    const blob = await createCanvasBlob(canvas);

    if (options.fileHandle) {
        const writable = await options.fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return { success: true, method: "file-handle" };
    }

    if (options.saveHandlePromise) {
        const handle = await options.saveHandlePromise;
        if (handle) {
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return { success: true, method: "file-picker" };
        }
    }

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.download = fileName;
    link.href = url;
    link.rel = "noopener";
    link.style.display = "none";
    document.body.appendChild(link);

    try {
        link.click();
    } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    return { success: true, method: "download-link" };
}

export async function downloadProductSnapshot(card, options = {}) {
    const product = getProductData(card);

    if (!product.image) {
        throw new Error("PRODUCT_IMAGE_NOT_FOUND");
    }

    try {
        await ensureImageIsReady(product.image);

        if (typeof product.image.decode === "function") {
            await product.image.decode();
        }

        const canvas = createSnapshotCanvas(product);
        await downloadCanvas(canvas, createFileName(product.name), options);
        return { success: true };
    } catch (error) {
        const isSecurityError = error instanceof DOMException && error.name === "SecurityError";
        const isCorsError = error.message?.includes("CORS") || error.message?.includes("cross-origin");

        if (isSecurityError || isCorsError) {
            console.warn("CORS restriction detected, generating with placeholder");
            const fallbackCanvas = createSnapshotCanvas(product, { includeImage: false });
            await downloadCanvas(fallbackCanvas, createFileName(product.name), options);
            throw new Error("CORS_RESTRICTION");
        }

        if (error.message === "IMAGE_LOAD_FAILED") {
            throw error;
        }

        console.error("Error generating snapshot:", error);
        throw error;
    }
}

// ============================================
// GENERACIÓN DEL SNAPSHOT (NUEVO DISEÑO)
// ============================================

function createSnapshotCanvas(product, options = {}) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const includeImage = options.includeImage !== false;

    canvas.width = SNAPSHOT_WIDTH;
    canvas.height = SNAPSHOT_HEIGHT;

    const centerX = SNAPSHOT_WIDTH / 2;

    // ========== FONDO CREMA CON DEGRADADO ==========
    const bgGradient = context.createRadialGradient(
        centerX, SNAPSHOT_HEIGHT / 3,
        100,
        centerX, SNAPSHOT_HEIGHT / 2,
        SNAPSHOT_HEIGHT
    );
    bgGradient.addColorStop(0, "#FFF8ED");
    bgGradient.addColorStop(1, "#F5E6D3");
    context.fillStyle = bgGradient;
    context.fillRect(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

    // ========== TEXTURA DE PAPEL (MUY SUTIL) ==========
    context.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < SNAPSHOT_WIDTH; i += 4) {
        for (let j = 0; j < SNAPSHOT_HEIGHT; j += 4) {
            if (Math.random() > 0.97) {
                context.fillRect(i, j, 2, 2);
            }
        }
    }

    // ========== BORDE EXTERIOR (4px) ==========
    const borderRadius = 28;
    const borderPadding = 8;

    // Borde marrón oscuro
    context.fillStyle = COLORS.brown;
    drawRoundedRect(context, borderPadding, borderPadding,
        SNAPSHOT_WIDTH - borderPadding * 2,
        SNAPSHOT_HEIGHT - borderPadding * 2,
        borderRadius);
    context.fill();

    // Borde blanco interior muy fino
    context.fillStyle = "rgba(255,255,255,0.5)";
    drawRoundedRect(context, borderPadding + 4, borderPadding + 4,
        SNAPSHOT_WIDTH - (borderPadding + 4) * 2,
        SNAPSHOT_HEIGHT - (borderPadding + 4) * 2,
        borderRadius - 2);
    context.fill();

    // ========== FONDO INTERIOR CREMA ==========
    const innerPadding = borderPadding + 6;
    context.fillStyle = COLORS.cream;
    drawRoundedRect(context, innerPadding, innerPadding,
        SNAPSHOT_WIDTH - innerPadding * 2,
        SNAPSHOT_HEIGHT - innerPadding * 2,
        borderRadius - 4);
    context.fill();

    // ========== DECORACIONES ==========
    drawDecorations(context, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

    // ========== LOGO (ARRIBA) ==========
    // Logo ClauFood texto pequeño
    context.fillStyle = COLORS.orange;
    context.font = "700 28px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("🍔 Clau Food", centerX, 70);
    context.textAlign = "left";

    // ========== CINTA ROJA ==========
    drawRibbon(context, centerX - 280, 90, 560, 56);

    // ========== NOMBRE DEL PRODUCTO ==========
    const nameY = 200;
    context.fillStyle = COLORS.brownLight;
    context.font = "700 72px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(product.name.toUpperCase(), centerX, nameY);

    // Línea ondulada naranja debajo
    context.strokeStyle = COLORS.orange;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(centerX - 200, nameY + 20);
    for (let i = 0; i <= 400; i += 20) {
        context.lineTo(centerX - 200 + i, nameY + 20 + Math.sin(i * 0.05) * 8);
    }
    context.stroke();
    context.textAlign = "left";

    // ========== CATEGORÍA (PÍLDORA) ==========
    const categoryText = "🌭 " + getCategoryFromName(product.name).toUpperCase();
    drawCategoryPill(context, categoryText, centerX - 100, 250);

    // ========== IMAGEN PRINCIPAL ==========
    const imgStartY = 320;
    const imgHeight = 600;
    const imgWidth = SNAPSHOT_WIDTH - SNAPSHOT_PADDING * 2;

    // Marco blanco
    context.fillStyle = COLORS.white;
    drawRoundedRect(context, SNAPSHOT_PADDING, imgStartY, imgWidth, imgHeight, 24);
    context.fill();

    // Borde marrón
    context.strokeStyle = COLORS.brown;
    context.lineWidth = 4;
    drawRoundedRect(context, SNAPSHOT_PADDING, imgStartY, imgWidth, imgHeight, 24);
    context.stroke();

    if (includeImage) {
        drawCoveredImage(context, product.image,
            SNAPSHOT_PADDING + 12, imgStartY + 12,
            imgWidth - 24, imgHeight - 24);
    } else {
        drawPlaceholder(context,
            SNAPSHOT_PADDING + 12, imgStartY + 12,
            imgWidth - 24, imgHeight - 24);
    }

    // ========== PRECIO (SUPERPONIBLE) ==========
    const priceX = SNAPSHOT_WIDTH - SNAPSHOT_PADDING - 220;
    const priceY = imgStartY + imgHeight - 120;
    drawPriceTag(context, product.price, priceX, priceY);

    // ========== DESCRIPCIÓN ==========
    const descY = imgStartY + imgHeight + 60;
    drawDescriptionBlock(context, product.description, SNAPSHOT_PADDING + 20, descY);

    // ========== LÍNEA DIVISORIA ==========
    const dividerY = descY + 160;
    drawDividerLine(context, SNAPSHOT_PADDING + 40, dividerY, SNAPSHOT_WIDTH - SNAPSHOT_PADDING * 2 - 80);

    // ========== CAJA WHATSAPP ==========
    const waBoxY = dividerY + 40;
    const waBoxWidth = SNAPSHOT_WIDTH - SNAPSHOT_PADDING * 2;
    const waBoxHeight = 220;
    drawWhatsAppBox(context, SNAPSHOT_PADDING, waBoxY, waBoxWidth, waBoxHeight);

    // ========== DECORACIÓN VEGETAL ==========
    drawBasilLeaves(context, SNAPSHOT_WIDTH - 60, waBoxY + 30);

    // ========== PERSONAJE (CLAU) ==========
    drawCharacter(context, 30, waBoxY + waBoxHeight - 50);

    // ========== FOOTER ==========
    drawFooter(context, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

    return canvas;
}

function getCategoryFromName(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("perro")) return "PERROS";
    if (nameLower.includes("salchipapa")) return "SALCHIPAPAS";
    if (nameLower.includes("hamburguesa")) return "HAMBURGUESAS";
    if (nameLower.includes("asado")) return "ASADOS";
    if (nameLower.includes("pizza")) return "PIZZAS";
    return "ESPECIALES";
}

// ============================================
// HANDLER DE CLICKS (INIcializa el sistema)
// ============================================

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
                accept: { "image/png": [".png"] },
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
    if (!button) return;

    const card = button.closest(PRODUCT_CARD_SELECTOR);
    if (!card) return;

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

// Importar notificaciones (se asume que existen)
function showSuccessToast(message) {
    console.log(message);
}
function showErrorToast(message) {
    console.error(message);
}
function showWarningToast(message) {
    console.warn(message);
}

export function initProductSnapshot() {
    document.addEventListener("click", handleSnapshotClick);
}