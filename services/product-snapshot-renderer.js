export function downloadProductSnapshot(card) {
    const SNAPSHOT_WIDTH = 800;
    const SNAPSHOT_HEIGHT = 920;
    const SNAPSHOT_PADDING = 32;

    function getProductData(card) {
        const image = card.querySelector(".menu__image, .combos__image");
        const name = card.querySelector(".menu__name, .combos__name")?.textContent.trim() || "Producto";
        const description = card.querySelector(".menu__desc, .combos__desc")?.textContent.trim() || "";
        const price = card.querySelector(".menu__price, .combos__price")?.textContent.trim() || "";

        return {
            image,
            name,
            description,
            price,
        };
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
        context.fillStyle = "#ececec";
        context.fillRect(x, y, width, height);
        context.fillStyle = "#ffdd00";
        context.beginPath();
        context.arc(x + width / 2, y + height / 2 - 12, 48, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#111111";
        context.font = "700 20px Arial, Helvetica, sans-serif";
        context.textAlign = "center";
        context.fillText("Foto no incluida", x + width / 2, y + height / 2 + 60);
        context.font = "400 14px Arial, Helvetica, sans-serif";
        context.fillText("Abre la pagina en localhost", x + width / 2, y + height / 2 + 85);
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

    function createSnapshotCanvas(product, options = {}) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const contentWidth = SNAPSHOT_WIDTH - SNAPSHOT_PADDING * 2;
        const includeImage = options.includeImage !== false;

        canvas.width = SNAPSHOT_WIDTH;
        canvas.height = SNAPSHOT_HEIGHT;

        context.fillStyle = "#fff3cf";
        context.fillRect(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

        context.fillStyle = "#fffaf0";
        drawRoundedRect(context, SNAPSHOT_PADDING, SNAPSHOT_PADDING, contentWidth, SNAPSHOT_HEIGHT - SNAPSHOT_PADDING * 2, 8);
        context.fill();

        context.strokeStyle = "#252934";
        context.lineWidth = 3;
        drawRoundedRect(context, SNAPSHOT_PADDING, SNAPSHOT_PADDING, contentWidth, SNAPSHOT_HEIGHT - SNAPSHOT_PADDING * 2, 8);
        context.stroke();

        const imageHeight = contentWidth * 0.75;

        if (includeImage) {
            drawCoveredImage(context, product.image, SNAPSHOT_PADDING, SNAPSHOT_PADDING, contentWidth, imageHeight);
        } else {
            drawImagePlaceholder(context, SNAPSHOT_PADDING, SNAPSHOT_PADDING, contentWidth, imageHeight);
        }

        const infoStartY = SNAPSHOT_PADDING + imageHeight + 16;

        context.fillStyle = "#15171c";
        context.font = "700 28px Arial, Helvetica, sans-serif";
        wrapText(context, product.name, SNAPSHOT_PADDING + 16, infoStartY + 28, contentWidth - 32, 32, 2);

        context.fillStyle = "#60636c";
        context.font = "700 18px Arial, Helvetica, sans-serif";
        wrapText(context, product.description, SNAPSHOT_PADDING + 16, infoStartY + 72, contentWidth - 32, 22, 2);

        context.fillStyle = "#ffdd00";
        drawRoundedRect(context, SNAPSHOT_PADDING + 16, infoStartY + 110, 140, 40, 8);
        context.fill();

        context.fillStyle = "#000000";
        context.font = "700 24px Arial, Helvetica, sans-serif";
        context.textAlign = "center";
        context.fillText(product.price, SNAPSHOT_PADDING + 86, infoStartY + 135);

        context.fillStyle = "#60636c";
        context.font = "700 14px Arial, Helvetica, sans-serif";
        context.textAlign = "right";
        context.fillText("Clau Food", SNAPSHOT_WIDTH - SNAPSHOT_PADDING - 16, SNAPSHOT_HEIGHT - SNAPSHOT_PADDING - 12);

        return canvas;
    }

    function createFileName(productName) {
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

    async function downloadCanvas(canvas, fileName) {
        const link = document.createElement("a");
        const blob = await createCanvasBlob(canvas);
        const url = URL.createObjectURL(blob);

        link.download = fileName;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    async function downloadProductSnapshot(card) {
        const product = getProductData(card);

        if (!product.image) {
            return;
        }

        try {
            // Use native image.decode() for better performance
            await product.image.decode();
            const canvas = createSnapshotCanvas(product);
            await downloadCanvas(canvas, createFileName(product.name));
            return { success: true };
        } catch (error) {
            // Check if it's a security/CORS error
            const isSecurityError = error instanceof DOMException && error.name === "SecurityError";
            const isCorsError = error.message?.includes('CORS') || error.message?.includes('cross-origin');

            if (isSecurityError || isCorsError) {
                // Generate with placeholder and indicate CORS issue
                console.warn("CORS restriction detected, generating with placeholder");
                const fallbackCanvas = createSnapshotCanvas(product, { includeImage: false });
                await downloadCanvas(fallbackCanvas, createFileName(product.name));
                throw new Error('CORS_RESTRICTION');
            }

            // For other errors, throw to be handled by caller
            console.error("Error generating snapshot:", error);
            throw error;
        }
    }
}
