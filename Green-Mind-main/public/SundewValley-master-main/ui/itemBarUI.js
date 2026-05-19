class ItemBarUI extends GameObjectsMapContainer {
    static #itemsBarTiledStaticImage = null
    static ITEMS_PER_ROW = 9
    #boxSize
    #selected
    #latestHovered

    constructor(characterRef) {
        super(characterRef.getItemBar())
        this.#boxSize = Math.floor(GAME_ENGINE.ctx.canvas.width / 28)
        this.#selected = -1
        this.#latestHovered = null
        if (ItemBarUI.#itemsBarTiledStaticImage == null) ItemBarUI.#itemsBarTiledStaticImage = new TiledStaticImage("./ui/itemsBar.json")
    }

    static getItemsBarTiledStaticImage() {
        return this.#itemsBarTiledStaticImage
    }

    noContainerIsHovering() {
        return !Dialogues.isAnyDialoguePlaying() && !ItemBarUI.#itemsBarTiledStaticImage.isHovering()
    }

    getPadding() {
        return Math.floor(this.#boxSize / 2)
    }

    getBoxSize() {
        return this.#boxSize
    }

    update() {
        super.update();
        // Keyboard selection for item bar
        for (let i = 0; i < ItemBarUI.ITEMS_PER_ROW; i++) {
            const keyCode = `Digit${i + 1}`;
            if (Controller.keys[keyCode]) {
                // First time pressing '1' triggers the Plant tutorial using the TV-style popup
                if (i === 0 && !SaveManager.hasSeenVideo("Tutorial_Plant")) {
                    GAME_ENGINE.getPlayerUi().openAnimatedTV("./Game_Guide/Plant.gif");
                    SaveManager.markVideoAsSeen("Tutorial_Plant");
                    Controller.keys[keyCode] = false; // Prevent selection in same frame
                    return;
                }
                this.#selected = i;
            }
        }
    }

    drawKeyLabel(ctx, x, y, width, keyName) {
        const labelSize = Math.floor(width * 0.45);
        const lx = x + (width - labelSize) / 2;
        const ly = y + width - labelSize / 2;

        ctx.save();
        // Connector line
        ctx.strokeStyle = "rgba(160, 130, 90, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + width);
        ctx.lineTo(x + width / 2, ly);
        ctx.stroke();

        // Label box
        const grad = ctx.createLinearGradient(lx, ly, lx, ly + labelSize);
        grad.addColorStop(0, "#fdfcf0");
        grad.addColorStop(1, "#e0dcc0");
        ctx.fillStyle = grad;
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(lx, ly, labelSize, labelSize, 4);
        else ctx.rect(lx, ly, labelSize, labelSize);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(100, 80, 50, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Key text
        ctx.fillStyle = "#5d4037";
        ctx.font = `bold ${Math.floor(labelSize * 0.7)}px Verdana`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(keyName, lx + labelSize / 2, ly + labelSize / 2 + 1);
        ctx.restore();
    }

    drawTool(ctx, key, pixelX, pixelY, width, height, toolLevel = 0) {
        const boxWidth = this.#boxSize * 1.4;
        const boxHeight = this.#boxSize * 1.4;
        const boxStartX = pixelX;
        const boxStartY = pixelY;
        
        ctx.save();
        // Calm Dark Beige HUD Background
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        
        const barGradient = ctx.createLinearGradient(boxStartX, boxStartY, boxStartX, boxStartY + boxHeight);
        barGradient.addColorStop(0, "rgba(225, 200, 170, 0.96)");
        barGradient.addColorStop(1, "rgba(190, 160, 130, 0.96)");
        ctx.fillStyle = barGradient;

        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(boxStartX, boxStartY, boxWidth, boxHeight, 14);
        else ctx.rect(boxStartX, boxStartY, boxWidth, boxHeight);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(160, 130, 90, 0.8)"; 
        ctx.stroke();
        
        // Inner depth highlight
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.stroke();
        ctx.restore();

        // Draw icon
        const iconSize = this.#boxSize * 0.85;
        const iconPx = boxStartX + (boxWidth - iconSize) / 2;
        const iconPy = boxStartY + (boxHeight - iconSize) / 2;
        
        InventoryItems.drawImage(ctx, key, iconPx, iconPy, iconSize, iconSize, toolLevel)

        // Draw hotkey label
        const toolKeys = { "pot": "Q", "axe": "C", "hoe": "E" };
        if (toolKeys[key]) {
            this.drawKeyLabel(ctx, boxStartX, boxStartY, boxWidth, toolKeys[key]);
        }
    }

    //draw all the tools
    drawTools(ctx) {
        const padding = 20;
        ctx.save();
        const tools = ["pot", "axe", "hoe"];
        const gap = this.#boxSize * 1.6; // Increased gap to ensure NO overlapping
        
        tools.forEach((tool, index) => {
            const px = padding + index * gap;
            const py = padding; 
            
            // width and height are handled internally by the new drawTool
            this.drawTool(ctx, tool, px, py, 0, 0, 1);
        });
        ctx.restore();
    }

    caseItemBeingHovered(currentIndex, key) {
        // if player left-click this item
        if (Controller.mouse.leftClick) {
            // Click to drink logic
            if (key != null && InventoryItems.isDrink(key)) {
                if (Level.PLAYER.tryUseItem(key, 1)) {
                    EnergyManager.restore(EnergyManager.ENERGY_BY_ITEM[key] || 25);
                    ASSET_MANAGER.playSound("Empty_water_bucket1.ogg");
                }
                Controller.mouse.leftClick = false;
                return true;
            }
            // the item will be selected
            this.#selected = currentIndex
            return true
        }
        return false;
    }

    drawItem(ctx, key, value, index, pixelX, pixelY, width, height) {
        const isHovered = pixelX <= Controller.mouse.x && Controller.mouse.x <= pixelX + this.#boxSize && pixelY <= Controller.mouse.y && Controller.mouse.y <= pixelY + this.#boxSize;
        const isSelected = this.#selected === index;
        const paddingScale = 4;
        
        // --- ANIMATION LOGIC ---
        // A pulsating value between 0.3 and 0.8 for the hover/selection glow
        const pulse = Math.abs(Math.sin(Date.now() / 400)) * 0.5 + 0.3;

        ctx.save();
        // 1. Recessed "Sunken" Background
        const innerGradient = ctx.createLinearGradient(pixelX, pixelY, pixelX, pixelY + height);
        innerGradient.addColorStop(0, "rgba(0, 0, 0, 0.12)"); // Darker top
        innerGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)"); // Lighter bottom
        ctx.fillStyle = innerGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(pixelX - paddingScale, pixelY - paddingScale, width + paddingScale * 2, height + paddingScale * 2, 12);
        else ctx.rect(pixelX, pixelY, width, height);
        ctx.fill();

        // 2. 3D Inset Borders (Simulating depth without ShadowBlur)
        ctx.lineWidth = 2.5;
        // Top & Left (Darker Inner Shadow)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.moveTo(pixelX - paddingScale, pixelY + height + paddingScale);
        ctx.lineTo(pixelX - paddingScale, pixelY - paddingScale);
        ctx.lineTo(pixelX + width + paddingScale, pixelY - paddingScale);
        ctx.stroke();

        // Bottom & Right (Lighter Inner Highlight)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(pixelX - paddingScale, pixelY + height + paddingScale);
        ctx.lineTo(pixelX + width + paddingScale, pixelY + height + paddingScale);
        ctx.lineTo(pixelX + width + paddingScale, pixelY - paddingScale);
        ctx.stroke();

        // 3. Selection/Hover Glow (Shining from within)
        if (isSelected || isHovered) {
            const glowColor = isSelected ? `rgba(255, 215, 0, ${pulse * 0.4})` : `rgba(255, 255, 255, ${pulse * 0.3})`;
            ctx.fillStyle = glowColor;
            ctx.fill();
            
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = isSelected ? `rgba(255, 215, 0, ${pulse})` : `rgba(255, 255, 255, ${pulse})`;
            ctx.stroke();
        }
        ctx.restore();

        // draw item icon (slightly padded so it doesn't overflow)
        if (key != null) InventoryItems.drawImage(ctx, key, pixelX + width * 0.1, pixelY + height * 0.1, width * 0.8, height * 0.8);
        
        // if current item has been selected and hovering somewhere usable
        if (this.#selected === index && key != null && InventoryItems.isUsable(key) && this.noContainerIsHovering()) {
            if (GAME_ENGINE.getCurrentLevel() instanceof FarmLevel && Level.PLAYER.notDisablePlayerController()) {
                const onBlock = GAME_ENGINE.getCurrentLevel().getCoordinate(Controller.mouse.x, Controller.mouse.y, GAME_ENGINE.getCurrentLevel().getTileSize())
                if (onBlock != null) {
                    if (GAME_ENGINE.getCurrentLevel().canPlantOnTile(onBlock[0], onBlock[1])) {
                        ctx.fillStyle = 'rgba(127,255,0,0.5)';
                        if (Controller.mouse.leftClick && !Controller.mouse_prev.leftClick && Level.PLAYER.tryUseItem(key)) {
                            EnergyManager.consume(2);
                            ASSET_MANAGER.playSound("Empty_water_bucket1.ogg");
                            GAME_ENGINE.getCurrentLevel().addEntity(new Crop(key.replace('_seed', ''), onBlock[0], onBlock[1], GAME_ENGINE.getCurrentLevel()))
                            Controller.mouse.leftClick = false;
                        }
                    } else {
                        ctx.fillStyle = 'rgba(255,0,0,0.5)';
                    }
                    ctx.fillRect(
                        GAME_ENGINE.getCurrentLevel().getTileSize() * onBlock[0] + GAME_ENGINE.getCurrentLevel().getPixelX(),
                        GAME_ENGINE.getCurrentLevel().getTileSize() * onBlock[1] + GAME_ENGINE.getCurrentLevel().getPixelY(),
                        GAME_ENGINE.getCurrentLevel().getTileSize(), GAME_ENGINE.getCurrentLevel().getTileSize()
                    );
                    ctx.globalAlpha = 1;
                }
            }
            // Draw item on cursor
            InventoryItems.drawImage(ctx, key, Controller.mouse.x, Controller.mouse.y, width / 2, height / 2)
        }

        if (isHovered) {
            this.#latestHovered = {key, value}
            this.caseItemBeingHovered(index, key)
        }

        // render item number text
        if (value != null && value.amount > 1) {
            ctx.save();
            Font.update(ctx, Math.ceil(height * 0.45));
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 3;
            ctx.fillStyle = "#ffffff"; // Bright white for counts
            ctx.fillText(value.amount, pixelX + this.#boxSize - ctx.measureText(value.amount).width - 4, pixelY + this.#boxSize - 4);
            ctx.restore();
            ctx.restore();
        }
    }

    drawInfo(ctx) {
        if (this.#latestHovered != null && this.#latestHovered.value != null && this.#latestHovered.key != null) {
            const itemPrice = InventoryItems.PRICES[this.#latestHovered.key] != null ? InventoryItems.PRICES[this.#latestHovered.key] : 0
            // HUD tooltips (ItemBarUI) go UP, while Menu tooltips (Trade/Inventory) go DOWN
            // Reduced gap to make it closer to the cursor
            const isHUD = this.constructor.name === "ItemBarUI";
            const dy = isHUD ? Controller.mouse.y - 5 : Controller.mouse.y + 10;
            const offsetYMult = isHUD ? 1.0 : 0;
            
            // Revert back to a smaller text size (about the height of a tile / 2.5) that fits naturally with UI
            const hoverFontSize = Math.floor(ctx.canvas.height / 35);
            MessageBox.drawLines(
                ctx,
                [
                    `${InventoryItems.NAMES[this.#latestHovered.key] != null ? InventoryItems.NAMES[this.#latestHovered.key] : this.#latestHovered.key}:`,
                    `- Amount: ${this.#latestHovered.value.amount}`,
                    `- Price: ${itemPrice}`,
                    `- Total Value: ${itemPrice * this.#latestHovered.value.amount}`
                ],
                hoverFontSize,
                Controller.mouse.x, dy,
                undefined, undefined, 0, offsetYMult
            )
        }
    }

    drawItemBar(ctx) {
        super.draw(ctx)
        this.drawTools(ctx)
        
        const itemBarKeys = this.keys()
        const padding = this.getPadding()
        const boxSize = this.getBoxSize()
        const gap = Math.floor(padding * 0.4)
        
        // Calculate total width using the same gap logic as InventoryUI
        const totalItemsWidth = ItemBarUI.ITEMS_PER_ROW * boxSize + (ItemBarUI.ITEMS_PER_ROW - 1) * gap
        const colPad = Math.floor(padding * 0.8)
        
        this.setWidth(totalItemsWidth + colPad * 2)
        this.setHeight(boxSize + padding * 2)
        this.setPixelY(ctx.canvas.height - padding - this.getHeight())
        this.setPixelX((ctx.canvas.width - this.getWidth()) / 2)
        
        // Calm Dark Beige HUD Background (No Shadows)
        ctx.save();
        ctx.shadowBlur = 0; 
        const barGradient = ctx.createLinearGradient(this.getPixelX(), this.getPixelY(), this.getPixelX(), this.getPixelY() + this.getHeight());
        barGradient.addColorStop(0, "rgba(225, 200, 170, 0.96)");
        barGradient.addColorStop(1, "rgba(190, 160, 130, 0.96)");
        ctx.fillStyle = barGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight(), 20);
        else ctx.rect(this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight());
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(160, 130, 90, 0.6)"; // Darker organic border
        ctx.stroke();

        // 3.5. Draw "1" Indicator next to the bar (Left side) - Only if tutorial not seen yet
        if (!SaveManager.hasSeenVideo("Tutorial_Plant")) {
            const indicatorSize = this.#boxSize * 0.8;
            const ix = this.getPixelX() - indicatorSize - 10;
            const iy = this.getPixelY() + (this.getHeight() - indicatorSize) / 2;
            
            ctx.save();
            const grad = ctx.createLinearGradient(ix, iy, ix, iy + indicatorSize);
            grad.addColorStop(0, "#fdfcf0");
            grad.addColorStop(1, "#e0dcc0");
            ctx.fillStyle = grad;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(ix, iy, indicatorSize, indicatorSize, 10);
            else ctx.rect(ix, iy, indicatorSize, indicatorSize);
            ctx.fill();
            ctx.strokeStyle = "rgba(160, 130, 90, 0.8)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#5d4037";
            ctx.font = `bold ${Math.floor(indicatorSize * 0.7)}px Verdana`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("1", ix + indicatorSize / 2, iy + indicatorSize / 2 + 1);
            ctx.restore();
        }
        ctx.restore();

        const _pixelY = Math.floor(this.getPixelY() + padding)
        this.#latestHovered = null
        
        const gridStartX = this.getPixelX() + colPad
        
        for (let i = 0; i < ItemBarUI.ITEMS_PER_ROW; i++) {
            const _pixelX = gridStartX + i * (boxSize + gap)
            if (i < itemBarKeys.length) {
                const key = itemBarKeys[i]
                this.drawItem(ctx, key, this.get(key), i, _pixelX, _pixelY, boxSize, boxSize)
            } else {
                this.drawItem(ctx, null, null, i, _pixelX, _pixelY, boxSize, boxSize)
            }
        }
        
        if (Controller.keys["Escape"]) {
            this.#selected = -1
        }
    }

    draw(ctx) {
        this.drawItemBar(ctx)
        this.drawInfo(ctx)
    }
}