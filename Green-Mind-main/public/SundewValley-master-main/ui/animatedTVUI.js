class AnimatedTVUI {
    constructor(gifPath) {
        this.isOpening = true;
        this.cooldown = 15;
        this.gifPath = gifPath;
        this.domElement = null;
        this.initDOM();
    }

    initDOM() {
        // Create an image element for the GIF
        const img = document.createElement("img");
        img.src = this.gifPath;
        img.id = "animated-tv-overlay";
        img.style.position = "fixed";
        img.style.zIndex = "3000";
        img.style.pointerEvents = "none";
        img.style.borderRadius = "15px";
        img.style.boxShadow = "0 0 30px rgba(0,0,0,0.8)";
        img.style.objectFit = "contain";
        img.style.backgroundColor = "black";
        img.style.opacity = "0"; // Start invisible for smooth transition
        img.style.transition = "opacity 0.3s ease";
        
        document.body.appendChild(img);
        this.domElement = img;

        // Show after a tiny delay
        setTimeout(() => {
            if (this.domElement) this.domElement.style.opacity = "1";
        }, 50);
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        // If mouse is clicked or Escape is pressed, close the UI
        if ((Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) || Controller.keys["Escape"]) {
            this.isOpening = false;
            Controller.mouse.leftClick = false; // Consume click
            Controller.keys["Escape"] = false;
            this.cleanup();
        }
    }

    cleanup() {
        if (this.domElement) {
            this.domElement.style.opacity = "0";
            setTimeout(() => {
                if (this.domElement) this.domElement.remove();
            }, 300);
        }
    }

    draw(ctx) {
        const canvasRect = ctx.canvas.getBoundingClientRect();
        
        // Calculate dimensions (Square popup matching the Weather UI style)
        const sizeOnCanvas = ctx.canvas.height * 0.8;
        const scale = canvasRect.height / ctx.canvas.height;
        const domSize = sizeOnCanvas * scale;
        
        const centerX = canvasRect.left + canvasRect.width / 2;
        const centerY = canvasRect.top + canvasRect.height / 2;

        if (this.domElement) {
            this.domElement.style.width = domSize + "px";
            this.domElement.style.height = domSize + "px";
            this.domElement.style.left = (centerX - domSize / 2) + "px";
            this.domElement.style.top = (centerY - domSize / 2) + "px";
        }

        ctx.save();
        // 1. Dim Background on Canvas
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 2. Clear the area under the DOM element so it looks integrated
        // (Not strictly necessary but helps if gif is transparent)
        const canvasSize = sizeOnCanvas;
        const canvasX = (ctx.canvas.width - canvasSize) / 2;
        const canvasY = (ctx.canvas.height - canvasSize) / 2;

        ctx.fillStyle = "black";
        ctx.fillRect(canvasX - 5, canvasY - 5, canvasSize + 10, canvasSize + 10);

        // 3. Styled End Button
        const btnFontSize = 18;
        const btnPaddingX = btnFontSize * 1.5;
        const btnPaddingY = btnFontSize * 0.6;
        const btnX = ctx.canvas.width / 2 - btnFontSize * 2;
        const btnY = canvasY + canvasSize + 30;

        MessageButton.draw(ctx, "End", btnFontSize, btnX, btnY, btnPaddingX, btnPaddingY, true);

        ctx.restore();
    }
}
