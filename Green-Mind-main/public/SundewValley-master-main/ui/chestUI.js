class ChestUI extends InventoryUI {

    #chestContainer
    #currentChestPage = 0
    #chestRef

    constructor(characterRef, chestRef = new Chest(10, 10, GAME_ENGINE.getCurrentLevel())) {
        super(characterRef, "./ui/chest.json")
        this.BLOCK_X_OFFSET = -4
        this.ROWS_PER_PAGE = 3
        this.#chestRef = chestRef
        this.#chestContainer = new GameObjectsMapContainer(this.#chestRef.getInventory())
    }

    moveStuffBetweenContainers(currentIndex, key) {
        if (currentIndex >= 0) {
            if (currentIndex < ItemBarUI.ITEMS_PER_ROW) Level.PLAYER.putItemFromItemBarIntoTargetInventory(key, this.#chestRef, Controller.keys["AltLeft"] ? null : 1)
            else Level.PLAYER.putItemFromInventoryIntoTargetInventory(key, this.#chestRef, Controller.keys["AltLeft"] ? null : 1)
        } else {
            Level.PLAYER.takeItemOutOfTargetInventory(key, this.#chestRef, Controller.keys["AltLeft"] ? null : 1)
        }
    }

    closeUI() {
        GAME_ENGINE.getPlayerUi().closeChest()
    }

    draw(ctx) {
        // Draw the player's backpack using InventoryUI
        super.drawInventory(ctx)
        
        const padding = this.getPadding()
        const inventoryKeys = this.#chestContainer.keys()
        
        const gridBoxSize = this.getBoxSize();
        const gridSpacingX = gridBoxSize + padding * 0.5;
        const gridSpacingY = gridBoxSize + padding * 0.5;

        const ITEM_PER_PAGE = ItemBarUI.ITEMS_PER_ROW * this.ROWS_PER_PAGE
        const MAX_NUM_OF_PAGES = Math.ceil(this.#chestContainer.getNumOfItems() / ITEM_PER_PAGE)

        const totalGridWidth = ItemBarUI.ITEMS_PER_ROW * gridSpacingX - padding * 0.5;
        const totalGridHeight = this.ROWS_PER_PAGE * gridSpacingY - padding * 0.5;

        // Draw Chest panel ABOVE the backpack panel
        // (Backpack is centered, Chest can hover above it or to the right. We'll place it at the top-center)
        const uiWidth = totalGridWidth + padding * 3;
        const uiHeight = totalGridHeight + padding * 5;
        const uiX = (ctx.canvas.width - uiWidth) / 2;
        // Place the chest panel so it sits on top of the backpack but doesn't obscure the middle too much
        const uiY = ctx.canvas.height * 0.05;

        // Vibrant Orange Gold Chest Background (No Shadows)
        ctx.save();
        ctx.shadowBlur = 0; // Removed shadows
        const bgGradient = ctx.createLinearGradient(uiX, uiY, uiX, uiY + uiHeight);
        bgGradient.addColorStop(0, "rgba(255, 180, 50, 0.96)");
        bgGradient.addColorStop(1, "rgba(255, 120, 20, 0.96)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(uiX, uiY, uiWidth, uiHeight, 20);
        else ctx.rect(uiX, uiY, uiWidth, uiHeight);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 215, 0, 0.85)"; // Gold Border
        ctx.stroke();
        ctx.restore();
        
        const gridStartX = uiX + padding * 1.5;
        const gridStartY = uiY + padding * 2.5;

        let _fontSize = Math.floor(Level.PLAYER.getMapReference().getTileSize() / 2) * 0.75;
        ctx.save();
        ctx.fillStyle = "#2c1810"; // Dark coffee for readability
        ctx.font = `bold ${_fontSize}px 'Segoe UI', sans-serif`;
        ctx.fillText("Chest Storage", gridStartX, uiY + padding * 1.5);
        ctx.restore();

        // Pagination for chest
        const pY = uiY + uiHeight - padding * 1.5;
        if (MAX_NUM_OF_PAGES > 1) {
            MessageButton.draw(ctx, "<", _fontSize, gridStartX + uiWidth * 0.2, pY - _fontSize);
            MessageButton.draw(ctx, ">", _fontSize, gridStartX + uiWidth * 0.8, pY - _fontSize);
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (Controller.mouse.x >= gridStartX + uiWidth * 0.2 && Controller.mouse.x <= gridStartX + uiWidth * 0.2 + _fontSize * 2 && Controller.mouse.y >= pY - _fontSize * 1.5 && Controller.mouse.y <= pY) {
                    this.#currentChestPage = Math.max(this.#currentChestPage - 1, 0)
                } else if (Controller.mouse.x >= gridStartX + uiWidth * 0.8 - _fontSize && Controller.mouse.x <= gridStartX + uiWidth * 0.8 + _fontSize && Controller.mouse.y >= pY - _fontSize * 1.5 && Controller.mouse.y <= pY) {
                    this.#currentChestPage += 1
                }
            }
        }
        
        this.#currentChestPage = Math.min(this.#currentChestPage, Math.max(0, MAX_NUM_OF_PAGES - 1))
        
        for (let i = this.#currentChestPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            const _pixelX = gridStartX + (i % ItemBarUI.ITEMS_PER_ROW) * gridSpacingX;
            const _pixelY = gridStartY + (Math.floor(i % ITEM_PER_PAGE / ItemBarUI.ITEMS_PER_ROW)) * gridSpacingY;
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#chestContainer.get(key), -1 - i, _pixelX, _pixelY, gridBoxSize, gridBoxSize)
            } else {
                this.drawItem(ctx, null, null, -1 - i, _pixelX, _pixelY, gridBoxSize, gridBoxSize)
            }
        }
        
        // Draw decorative items next to chest ui like the original did (including 'cody' aka portrait_cow_kigurumi)
        const decoX = uiX + uiWidth + padding * 2;
        const decoY = uiY;
        
        GAME_ENGINE.ctx.drawImage(
            ASSET_MANAGER.getImage("items", "spring_and_summer_objects.png"),
            160, 176, 16, 16,
            decoX, decoY,
            gridBoxSize * 1.5, gridBoxSize * 1.5
        )
        GAME_ENGINE.ctx.drawImage(
            ASSET_MANAGER.getImage("portrait_cow_kigurumi.png"),
            0, 0, 128, 128,
            uiX - gridBoxSize * 3, uiY + uiHeight / 3, // Situate the portrait to the left of the chest
            gridBoxSize * 2.5, gridBoxSize * 2.5
        )

        this.drawInfo(ctx)
    }
}