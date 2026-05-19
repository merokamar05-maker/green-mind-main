class InventoryUI extends ItemBarUI {
    #backpackTiledStaticImage = null
    ROWS_PER_PAGE = 6
    #currentInventoryPage = 0
    #inventoryContainer


    constructor(characterRef, backpackTiledStaticImagePath = null) {
        super(characterRef)
        this.#inventoryContainer = new GameObjectsMapContainer(characterRef.getInventory())
        this.BLOCK_X_OFFSET = 0
        if (this.#backpackTiledStaticImage == null) this.#backpackTiledStaticImage = new TiledStaticImage(backpackTiledStaticImagePath == null ? "./ui/backpack.json" : backpackTiledStaticImagePath)
        this.isOpening = false
    }

    caseItemBeingHovered(currentIndex, key) {
        if (super.caseItemBeingHovered(currentIndex, key)) {
            return true
        } else if (key != null && !Controller.mouse_prev.rightClick && Controller.mouse.rightClick) {
            this.moveStuffBetweenContainers(currentIndex, key)
            return true
        }
        return false
    }

    moveStuffBetweenContainers(currentIndex, key) {
        if (currentIndex < ItemBarUI.ITEMS_PER_ROW) {
            Level.PLAYER.putItemIntoInventory(key, Controller.keys["AltLeft"] ? null : 1)
        } else if (this.getNumOfItems() < ItemBarUI.ITEMS_PER_ROW) {
            Level.PLAYER.takeItemOutOfInventory(key, Controller.keys["AltLeft"] ? null : 1)
        }
    }

    getBackpackTiledStaticImage() {
        return this.#backpackTiledStaticImage
    }

    noContainerIsHovering() {
        return false
    }

    closeUI() {
        this.isOpening = false
    }

    // Returns the computed backpack panel dimensions for ChestUI to use
    getBackpackLayout(ctx) {
        const padding = this.getPadding();
        const boxSize = this.getBoxSize();
        const gap = Math.floor(padding * 0.4);
        const innerGridWidth = ItemBarUI.ITEMS_PER_ROW * boxSize + (ItemBarUI.ITEMS_PER_ROW - 1) * gap;
        const innerGridHeight = this.ROWS_PER_PAGE * boxSize + (this.ROWS_PER_PAGE - 1) * gap;
        const colPad = Math.floor(padding * 0.8);
        const headerHeight = Math.floor(padding * 2);
        const footerHeight = Math.floor(padding * 1.5);
        const uiWidth = innerGridWidth + colPad * 2;
        const uiHeight = headerHeight + innerGridHeight + footerHeight;
        const uiX = Math.floor((ctx.canvas.width - uiWidth) / 2);
        return { uiX, uiWidth, uiHeight, colPad, headerHeight, footerHeight, innerGridWidth, innerGridHeight, boxSize, gap };
    }

    drawInventory(ctx) {
        this.drawItemBar(ctx)
        
        const padding = this.getPadding();
        const inventoryKeys = this.#inventoryContainer.keys();
        const boxSize = this.getBoxSize();
        const gap = Math.floor(padding * 0.4);
        
        // Calculate exact grid dimensions for 9 items per row
        const innerGridWidth = ItemBarUI.ITEMS_PER_ROW * boxSize + (ItemBarUI.ITEMS_PER_ROW - 1) * gap;
        const innerGridHeight = this.ROWS_PER_PAGE * boxSize + (this.ROWS_PER_PAGE - 1) * gap;
        
        const colPad = Math.floor(padding * 0.8);
        const headerHeight = Math.floor(padding * 2);
        const footerHeight = Math.floor(padding * 1.5);
        
        const uiWidth = innerGridWidth + colPad * 2;
        const uiHeight = headerHeight + innerGridHeight + footerHeight;
        const uiX = Math.floor((ctx.canvas.width - uiWidth) / 2);
        // Position: sits above the item bar with some space
        const uiY = Math.floor(this.getPixelY() - uiHeight - padding);

        // Lighter Amber & Cream Backpack Background (No Shadows)
        ctx.save();
        ctx.shadowBlur = 0; 
        const bgGradient = ctx.createLinearGradient(uiX, uiY, uiX, uiY + uiHeight);
        bgGradient.addColorStop(0, "rgba(255, 240, 180, 0.96)");
        bgGradient.addColorStop(1, "rgba(255, 210, 100, 0.96)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(uiX, uiY, uiWidth, uiHeight, 20);
        else ctx.rect(uiX, uiY, uiWidth, uiHeight);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 180, 0, 0.5)"; // Soft Amber Border
        ctx.stroke();
        ctx.restore();

        const ITEM_PER_PAGE = ItemBarUI.ITEMS_PER_ROW * this.ROWS_PER_PAGE;
        const MAX_NUM_OF_PAGES = Math.max(1, Math.ceil(this.#inventoryContainer.getNumOfItems() / ITEM_PER_PAGE));
        
        const gridStartX = uiX + colPad;
        const gridStartY = uiY + headerHeight;

        // Title text
        let _fontSize = Math.floor(boxSize * 0.35);
        ctx.save();
        ctx.fillStyle = "#3e2723"; // Rich chocolate for contrast
        ctx.font = `bold ${_fontSize}px 'Segoe UI', sans-serif`;
        ctx.fillText("Backpack", gridStartX, uiY + headerHeight - _fontSize * 0.5);
        ctx.restore();

        // Pagination
        if (MAX_NUM_OF_PAGES > 1) {
            const arrowY = uiY + uiHeight - footerHeight + gap;
            if (MessageButton.draw(ctx, "<", _fontSize, gridStartX, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentInventoryPage = Math.max(this.#currentInventoryPage - 1, 0);
            }
            if (MessageButton.draw(ctx, ">", _fontSize, gridStartX + innerGridWidth - _fontSize * 2, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentInventoryPage = Math.min(this.#currentInventoryPage + 1, MAX_NUM_OF_PAGES - 1);
            }
        }
        this.#currentInventoryPage = Math.min(this.#currentInventoryPage, MAX_NUM_OF_PAGES - 1);
        
        // Draw grid
        for (let i = this.#currentInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            const col = i % ItemBarUI.ITEMS_PER_ROW;
            const row = Math.floor((i % ITEM_PER_PAGE) / ItemBarUI.ITEMS_PER_ROW);
            const px = gridStartX + col * (boxSize + gap);
            const py = gridStartY + row * (boxSize + gap);
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i];
                this.drawItem(ctx, key, this.#inventoryContainer.get(key), i + ItemBarUI.ITEMS_PER_ROW, px, py, boxSize, boxSize);
            } else {
                this.drawItem(ctx, null, null, i + ItemBarUI.ITEMS_PER_ROW, px, py, boxSize, boxSize);
            }
        }
        
        // Close button
        if (MessageButton.draw(ctx, "Close", _fontSize * 1.2, uiX + uiWidth - _fontSize * 5, uiY + uiHeight + _fontSize * 0.5)) {
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                this.closeUI();
            }
        }
    }

    draw(ctx) {
        this.drawInventory(ctx)
        this.drawInfo(ctx)
    }
}