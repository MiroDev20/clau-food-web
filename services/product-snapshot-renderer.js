const SNAPSHOT_WIDTH = 600;
const SNAPSHOT_HEIGHT = 750;
const SNAPSHOT_PADDING = 24;

function getProductData(card) {
    const image = card.querySelector(".product-card__image, .menu__image, .combos__image");
    const name = card.querySelector(".product-card__name, .menu__name, .combos__name")?.textContent.trim() || image?.alt?.trim() || "Producto";
    const description = card.querySelector(".product-card__desc, .menu__desc, .combos__desc")?.textContent.trim() || "";
    const price = card.querySelector(".product-card__price, .menu__price, .combos__price")?.textContent.trim() || "";

    return {
        image,
        name,
        description,
        price,
    };
}

async function ensureImageIsReady(image) {
    if (!image) {
        return;
    }

    if (!image.src && image.dataset.src) {
        image.src = image.dataset.src;
    }

    if (image.complete && image.naturalWidth > 0) {
        return;
    }

    await new Promise((resolve, reject) => {
        const handleLoad = () => {
            cleanup();
            resolve();
        };

        const handleError = () => {
            cleanup();
            reject(new Error("IMAGE_LOAD_FAILED"));
        };

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
    drawRoundedRect(context, x, y, width, height, 8);
    context.clip();
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    context.restore();
}

function drawImagePlaceholder(context, x, y, width, height) {
    context.save();
    drawRoundedRect(context, x, y, width, height, 8);
    context.clip();

    // Fondo degradado
    const gradient = context.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, "#f0f0f0");
    gradient.addColorStop(1, "#d8d8d8");
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);

    // Icono de plato/food
    context.fillStyle = COLORS.coral;
    context.beginPath();
    context.arc(x + width / 2, y + height / 2 - 20, 50, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = COLORS.border;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x + width / 2, y + height / 2 - 20, 50, 0, Math.PI * 2);
    context.stroke();

    // Texto
    context.fillStyle = COLORS.ink;
    context.font = "700 18px Arial, Helvetica, sans-serif";
    context.textAlign = "center";
    context.fillText("IMAGEN", x + width / 2, y + height / 2 + 50);
    context.fillText("NO DISPONIBLE", x + width / 2, y + height / 2 + 75);
    context.textAlign = "left";
    context.restore();
}

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(" ").filter(Boolean);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;

        if (context.measureText(nextLine).width <= maxWidth) {
            currentLine = nextLine;
            return;
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        currentLine = word;
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    lines.slice(0, maxLines).forEach((line, index) => {
        const finalLine = index === maxLines - 1 && lines.length > maxLines ? `${line}...` : line;
        context.fillText(finalLine, x, y + index * lineHeight);
    });
}

// ============================================
// NEW DESIGN - COLORS AND STYLE
// ============================================
const COLORS = {
    coral: "#FF5757",
    redWarm: "#F04E4E",
    yellow: "#FFD230",
    cream: "#FBE8B6",
    white: "#FFFFFF",
    brown: "#7B3F26",
    green: "#59C135",
    orange: "#FF9F1A",
    border: "#5a2d1f",
    ink: "#2d1810",
    muted: "#6b4535"
};

function createSnapshotCanvas(product, options = {}) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const contentWidth = SNAPSHOT_WIDTH - SNAPSHOT_PADDING * 2;
    const includeImage = options.includeImage !== false;

    canvas.width = SNAPSHOT_WIDTH;
    canvas.height = SNAPSHOT_HEIGHT;

    // ========== FONDO PRINCIPAL ==========
    context.fillStyle = COLORS.coral;
    context.fillRect(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

    // Decoraciones de fondo (estrellas y puntos)
    context.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 8; i++) {
        const x = 60 + i * 100;
        const y = 40 + (i % 3) * 30;
        context.beginPath();
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
    }
    for (let i = 0; i < 6; i++) {
        const x = 90 + i * 120;
        const y = SNAPSHOT_HEIGHT - 60 - (i % 2) * 40;
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fill();
    }

    // ========== CAJA PRINCIPAL (FONDO CREMA) ==========
    const boxTop = SNAPSHOT_PADDING;
    const boxHeight = SNAPSHOT_HEIGHT - SNAPSHOT_PADDING * 2;

    context.fillStyle = COLORS.cream;
    drawRoundedRect(context, SNAPSHOT_PADDING, boxTop, contentWidth, boxHeight, 16);
    context.fill();

    // Borde estilo cómic
    context.strokeStyle = COLORS.border;
    context.lineWidth = 5;
    drawRoundedRect(context, SNAPSHOT_PADDING, boxTop, contentWidth, boxHeight, 16);
    context.stroke();

    // ========== IMAGEN DEL PRODUCTO ==========
    const imageHeight = contentWidth * 0.55;
    const imageTop = SNAPSHOT_PADDING + 8;

    // Marco de la imagen
    context.fillStyle = COLORS.white;
    drawRoundedRect(context, SNAPSHOT_PADDING + 8, imageTop, contentWidth - 16, imageHeight - 8, 12);
    context.fill();

    context.strokeStyle = COLORS.border;
    context.lineWidth = 4;
    drawRoundedRect(context, SNAPSHOT_PADDING + 8, imageTop, contentWidth - 16, imageHeight - 8, 12);
    context.stroke();

    if (includeImage) {
        const imgX = SNAPSHOT_PADDING + 16;
        const imgY = imageTop + 4;
        const imgW = contentWidth - 32;
        const imgH = imageHeight - 16;
        drawCoveredImage(context, product.image, imgX, imgY, imgW, imgH);
    } else {
        drawImagePlaceholder(context, SNAPSHOT_PADDING + 16, imageTop + 4, contentWidth - 32, imageHeight - 16);
    }

    // ========== NOMBRE DEL PRODUCTO ==========
    const infoStartY = imageTop + imageHeight + 12;

    context.fillStyle = COLORS.ink;
    context.font = "700 36px Arial, Helvetica, sans-serif";
    wrapText(context, product.name.toUpperCase(), SNAPSHOT_PADDING + 20, infoStartY + 32, contentWidth - 40, 40, 2);

    // ========== DESCRIPCIÓN ==========
    context.fillStyle = COLORS.muted;
    context.font = "600 16px Arial, Helvetica, sans-serif";
    wrapText(context, product.description, SNAPSHOT_PADDING + 20, infoStartY + 85, contentWidth - 40, 22, 2);

    // ========== PRECIO (ESTILO BOTÓN) ==========
    const priceY = infoStartY + 120;
    const priceWidth = 140;
    const priceHeight = 44;
    const priceRadius = priceHeight / 2; // Mitad de la altura para píldora perfecta

    // Fondo amarillo del precio
    context.fillStyle = COLORS.yellow;
    drawRoundedRect(context, SNAPSHOT_PADDING + 20, priceY, priceWidth, priceHeight, priceRadius);
    context.fill();

    // Borde del precio
    context.strokeStyle = COLORS.border;
    context.lineWidth = 3;
    drawRoundedRect(context, SNAPSHOT_PADDING + 20, priceY, priceWidth, priceHeight, priceRadius);
    context.stroke();

    // Texto del precio (rojo)
    context.fillStyle = COLORS.redWarm;
    context.font = "700 22px Arial, Helvetica, sans-serif";
    context.textAlign = "center";
    context.fillText(product.price, SNAPSHOT_PADDING + 20 + priceWidth / 2, priceY + 28);

    // ========== LOGO / MARCA ==========
    context.fillStyle = COLORS.coral;
    context.font = "900 18px Arial, Helvetica, sans-serif";
    context.textAlign = "right";
    context.fillText("CLAU FOOD", SNAPSHOT_WIDTH - SNAPSHOT_PADDING - 20, SNAPSHOT_HEIGHT - 30);

    // ========== LINDA DECORACIÓN EXTRA ==========
    // Estrella decorativa
    context.fillStyle = COLORS.yellow;
    context.beginPath();
    context.moveTo(SNAPSHOT_WIDTH - 100, SNAPSHOT_HEIGHT - 40);
    for (let i = 1; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        context.lineTo(SNAPSHOT_WIDTH - 100 + Math.cos(angle) * 8, SNAPSHOT_HEIGHT - 40 + Math.sin(angle) * 8);
    }
    context.closePath();
    context.fill();

    context.textAlign = "left";
    return canvas;
}

export function createFileName(productName) {
    const slug = productName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${slug || "producto"}-clau-food.png`;
}

function createCanvasBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
                return;
            }

            reject(new Error("No se pudo generar la imagen."));
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
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
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
