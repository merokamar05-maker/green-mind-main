class TradeUI extends ItemBarUI {
    static INVENTORY_ITEMS_PER_ROW = 5
    static ROWS_PER_PAGE = 7
    #tradeTiledStaticImage = null
    #currentThisInventoryPage = 0
    #currentTargetInventoryPage = 0
    #fromInventoryContainer
    #toInventoryContainer
    #fromCharacterRef
    #toCharacterRef


    constructor(fromCharacterRef, toCharacterRef) {
        super(fromCharacterRef)
        this.#fromCharacterRef = fromCharacterRef
        this.#toCharacterRef = toCharacterRef
        this.#fromInventoryContainer = new GameObjectsMapContainer(fromCharacterRef.getInventory())
        this.#toInventoryContainer = new GameObjectsMapContainer(toCharacterRef.getInventory())
        this.BLOCK_X_OFFSET = 0
        if (this.#tradeTiledStaticImage == null) this.#tradeTiledStaticImage = new TiledStaticImage("./ui/trade.json")
        this.isOpening = true
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
        // Trash can only be given to the recycler (Tawfiq) - not sold in trade screens
        if (key === "trash") {
            return;
        }

        if (currentIndex >= 0) {
            if (InventoryItems.PRICES[key] != null) {
                if (currentIndex < ItemBarUI.ITEMS_PER_ROW) {
                    const numOfItem = Controller.keys["AltLeft"] ? this.#fromCharacterRef.getItemBar()[key]["amount"] : 1
                    const moneyRequired = numOfItem * InventoryItems.PRICES[key]
                    if (this.#toCharacterRef.getMoney() >= moneyRequired) {
                        this.#fromCharacterRef.earnMoney(moneyRequired)
                        this.#toCharacterRef.earnMoney(-moneyRequired)
                        this.#fromCharacterRef.putItemFromItemBarIntoTargetInventory(key, this.#toCharacterRef, numOfItem)
                        QuestManager.notifySell(numOfItem)
                    }
                } else {
                    const numOfItem = Controller.keys["AltLeft"] ? this.#fromCharacterRef.getInventory()[key]["amount"] : 1
                    const moneyRequired = numOfItem * InventoryItems.PRICES[key]
                    if (this.#toCharacterRef.getMoney() >= moneyRequired) {
                        this.#fromCharacterRef.earnMoney(moneyRequired)
                        this.#toCharacterRef.earnMoney(-moneyRequired)
                        this.#fromCharacterRef.putItemFromInventoryIntoTargetInventory(key, this.#toCharacterRef, numOfItem)
                        QuestManager.notifySell(numOfItem)
                    }
                }
            }
        } else {
            if (InventoryItems.PRICES[key] != null) {
                const numOfItem = Controller.keys["AltLeft"] ? this.#toCharacterRef.getInventory()[key]["amount"] : 1
                const moneyRequired = numOfItem * InventoryItems.PRICES[key]
                if (this.#fromCharacterRef.getMoney() >= moneyRequired) {
                    // Logic to drink immediately if energy is not full
                    if (InventoryItems.isDrink(key) && EnergyManager.get() < 100) {
                        this.#fromCharacterRef.earnMoney(-moneyRequired);
                        this.#toCharacterRef.earnMoney(moneyRequired);
                        // Restore energy instead of putting into inventory
                        const energyGain = (EnergyManager.ENERGY_BY_ITEM[key] || 25) * numOfItem;
                        EnergyManager.restore(energyGain);
                        ASSET_MANAGER.playSound("Empty_water_bucket1.ogg");
                    } else {
                        // Usual purchase (goes to inventory)
                        this.#fromCharacterRef.earnMoney(-moneyRequired)
                        this.#toCharacterRef.earnMoney(moneyRequired)
                        this.#fromCharacterRef.takeItemOutOfTargetInventory(key, this.#toCharacterRef, numOfItem)
                    }
                }
            }
        }
    }

    noContainerIsHovering() {
        return false
    }

    closeUI() {
        this.isOpening = false
    }

    draw(ctx) {
        this.drawItemBar(ctx)
        
        const padding = this.getPadding();
        const boxSize = this.getBoxSize();
        // Gap between boxes
        const gap = Math.floor(padding * 0.4);
        
        // Calculate exact grid dimensions for one column (5 items per row)
        const innerGridWidth = TradeUI.INVENTORY_ITEMS_PER_ROW * boxSize + (TradeUI.INVENTORY_ITEMS_PER_ROW - 1) * gap;
        const innerGridHeight = TradeUI.ROWS_PER_PAGE * boxSize + (TradeUI.ROWS_PER_PAGE - 1) * gap;
        
        // Each column = inner grid + some padding on left and right
        const colPad = Math.floor(padding * 0.8);
        const colWidth = innerGridWidth + colPad * 2;
        
        // Total UI = 2 columns + divider gap
        const dividerGap = Math.floor(padding * 0.5);
        const headerHeight = Math.floor(padding * 2.5);
        const footerHeight = Math.floor(padding * 1.5);
        
        const uiWidth = colWidth * 2 + dividerGap;
        const uiHeight = headerHeight + innerGridHeight + footerHeight;
        const uiX = Math.floor((ctx.canvas.width - uiWidth) / 2);
        const uiY = Math.floor((ctx.canvas.height - uiHeight) / 2 - padding);

        // Lighter Amber & Cream Trading Background (No Shadows)
        ctx.save();
        ctx.shadowBlur = 0; 
        const bgGradient = ctx.createLinearGradient(uiX, uiY, uiX, uiY + uiHeight);
        bgGradient.addColorStop(0, "rgba(255, 245, 180, 0.96)");
        bgGradient.addColorStop(1, "rgba(255, 215, 100, 0.96)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(uiX, uiY, uiWidth, uiHeight, 20);
        else ctx.rect(uiX, uiY, uiWidth, uiHeight);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 180, 0, 0.5)"; // Soft Amber Border
        ctx.stroke();
        ctx.restore();
        // Divider line 
        const dividerX = uiX + colWidth + Math.floor(dividerGap / 2);
        ctx.beginPath();
        ctx.moveTo(dividerX, uiY + 15);
        ctx.lineTo(dividerX, uiY + uiHeight - 15);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(160, 130, 90, 0.25)"; // Calmer organic divider
        ctx.stroke();
        ctx.restore();

        // Title Texts
        let _fontSize = Math.floor(boxSize * 0.35);
        ctx.save();
        ctx.fillStyle = "#2c1810"; // Dark coffee for readability
        ctx.font = `bold ${_fontSize}px 'Segoe UI', sans-serif`;
        ctx.fillText("Your Items (" + this.#fromCharacterRef.getMoney() + "G)", uiX + colPad, uiY + headerHeight - _fontSize * 0.5);
        ctx.fillText("Shop Items (" + this.#toCharacterRef.getMoney() + "G)", uiX + colWidth + dividerGap + colPad, uiY + headerHeight - _fontSize * 0.5);
        ctx.restore();

        this.#tradeTiledStaticImage.setTileWidth(boxSize);
        this.#tradeTiledStaticImage.setTileHeight(boxSize);

        const ITEM_PER_PAGE = TradeUI.INVENTORY_ITEMS_PER_ROW * TradeUI.ROWS_PER_PAGE;
        const leftGridX = uiX + colPad;
        const rightGridX = uiX + colWidth + dividerGap + colPad;
        const gridStartY = uiY + headerHeight;

        /* ===== LEFT: Player's inventory ===== */
        let inventoryKeys = this.#fromInventoryContainer.keys();
        let MAX_PAGES = Math.max(1, Math.ceil(this.#fromInventoryContainer.getNumOfItems() / ITEM_PER_PAGE));
        
        if (MAX_PAGES > 1) {
            const arrowY = uiY + uiHeight - footerHeight + gap;
            if (MessageButton.draw(ctx, "<", _fontSize, leftGridX, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentThisInventoryPage = Math.max(this.#currentThisInventoryPage - 1, 0);
            }
            if (MessageButton.draw(ctx, ">", _fontSize, leftGridX + innerGridWidth - _fontSize * 2, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentThisInventoryPage = Math.min(this.#currentThisInventoryPage + 1, MAX_PAGES - 1);
            }
        }
        this.#currentThisInventoryPage = Math.min(this.#currentThisInventoryPage, MAX_PAGES - 1);
        
        for (let i = this.#currentThisInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            const col = i % TradeUI.INVENTORY_ITEMS_PER_ROW;
            const row = Math.floor((i % ITEM_PER_PAGE) / TradeUI.INVENTORY_ITEMS_PER_ROW);
            const px = leftGridX + col * (boxSize + gap);
            const py = gridStartY + row * (boxSize + gap);
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i];
                this.drawItem(ctx, key, this.#fromInventoryContainer.get(key), i + ItemBarUI.ITEMS_PER_ROW, px, py, boxSize, boxSize);
            } else {
                this.drawItem(ctx, null, null, i + ItemBarUI.ITEMS_PER_ROW, px, py, boxSize, boxSize);
            }
        }

        /* ===== RIGHT: NPC's inventory ===== */
        inventoryKeys = this.#toInventoryContainer.keys();
        MAX_PAGES = Math.max(1, Math.ceil(this.#toInventoryContainer.getNumOfItems() / ITEM_PER_PAGE));
        
        if (MAX_PAGES > 1) {
            const arrowY = uiY + uiHeight - footerHeight + gap;
            if (MessageButton.draw(ctx, "<", _fontSize, rightGridX, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentTargetInventoryPage = Math.max(this.#currentTargetInventoryPage - 1, 0);
            }
            if (MessageButton.draw(ctx, ">", _fontSize, rightGridX + innerGridWidth - _fontSize * 2, arrowY)) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick)
                    this.#currentTargetInventoryPage = Math.min(this.#currentTargetInventoryPage + 1, MAX_PAGES - 1);
            }
        }
        this.#currentTargetInventoryPage = Math.min(this.#currentTargetInventoryPage, MAX_PAGES - 1);
        
        for (let i = this.#currentTargetInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            const col = i % TradeUI.INVENTORY_ITEMS_PER_ROW;
            const row = Math.floor((i % ITEM_PER_PAGE) / TradeUI.INVENTORY_ITEMS_PER_ROW);
            const px = rightGridX + col * (boxSize + gap);
            const py = gridStartY + row * (boxSize + gap);
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i];
                this.drawItem(ctx, key, this.#toInventoryContainer.get(key), -(i + ItemBarUI.ITEMS_PER_ROW), px, py, boxSize, boxSize);
            } else {
                this.drawItem(ctx, null, null, -(i + ItemBarUI.ITEMS_PER_ROW), px, py, boxSize, boxSize);
            }
        }

        // Done button
        if (MessageButton.draw(ctx, "Done", _fontSize * 1.2, uiX + uiWidth - _fontSize * 5, uiY + uiHeight + _fontSize * 0.5)) {
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                this.closeUI();
            }
        }

        // Character portraits
        const portraitSize = boxSize * 1.2;
        this.#fromCharacterRef.getCurrentAnimation().drawFrame(
            GAME_ENGINE.clockTick, ctx,
            leftGridX + innerGridWidth - portraitSize, uiY + _fontSize * 0.3,
            portraitSize, portraitSize
        );
        this.#toCharacterRef.getCurrentAnimation().drawFrame(
            GAME_ENGINE.clockTick, ctx,
            rightGridX + innerGridWidth - portraitSize, uiY + _fontSize * 0.3,
            portraitSize, portraitSize
        );
        
        this.drawInfo(ctx);
    }
}