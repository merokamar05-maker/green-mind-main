class UserInterfaces {
    static displayTitle = true
    #UI = {}
    #CURRENT

    constructor() {
        GUI.init()
        this.#UI.chest = null
        this.#UI.weather = null
        this.#UI.animatedTV = null
        this.#UI.itemBar = new ItemBarUI(Level.PLAYER)
        this.#UI.inventory = new InventoryUI(Level.PLAYER)
        this.#CURRENT = this.#UI.itemBar
    }

    openChest(chestRef) {
        this.#UI.chest = new ChestUI(Level.PLAYER, chestRef)
    }

    openWeather() {
        this.#UI.weather = new WeatherForecastUI();
    }

    openAnimatedTV(gifPath) {
        this.#UI.animatedTV = new AnimatedTVUI(gifPath);
    }

    startATrade(targetUI) {
        this.#UI.trade = new TradeUI(Level.PLAYER, targetUI)
    }

    noUiIsOpening() {
        return this.#UI.chest == null && this.#UI.trade == null && this.#UI.weather == null && this.#UI.animatedTV == null && !AchievementManager.isGalleryOpen
    }

    closeChest() {
        this.#UI.chest = null
    }

    update() {
        if (UserInterfaces.displayTitle === true) return
        QuestUI.update(GAME_ENGINE.clockTick)
        AchievementManager.update(GAME_ENGINE.clockTick)
        LetterUI.update(GAME_ENGINE.clockTick)

        // Toggle achievement gallery with X key
        if (Controller.keys["KeyX"] && Level.PLAYER) {
            // Only allow opening if no other UI is open, but ALWAYS allow closing
            if (AchievementManager.isGalleryOpen || Level.PLAYER.notDisablePlayerController()) {
                AchievementManager.isGalleryOpen = !AchievementManager.isGalleryOpen;
                Controller.keys["KeyX"] = false;
            }
        }

        if (this.#UI.chest != null) {
            this.#CURRENT = this.#UI.chest
        } else if (this.#UI.animatedTV != null) {
            if (this.#UI.animatedTV.isOpening) {
                this.#CURRENT = this.#UI.animatedTV
            } else {
                this.#UI.animatedTV = null
                Controller.mouse.leftClick = false;
            }
        } else if (this.#UI.weather != null) {
            if (this.#UI.weather.isOpening) {
                this.#CURRENT = this.#UI.weather
            } else {
                this.#UI.weather = null
                Controller.mouse.leftClick = false; // Prevent re-triggering the TV in the same frame
            }
        } else if (this.#UI.trade != null) {
            if (this.#UI.trade.isOpening) {
                this.#CURRENT = this.#UI.trade
            } else {
                this.#UI.trade = null
            }
        } else if (this.#UI.inventory.isOpening) {
            this.#CURRENT = this.#UI.inventory
        } else {
            if (Controller.keys["KeyI"]) {
                this.#UI.inventory.isOpening = true
                this.#CURRENT = this.#UI.inventory
            } else {
                this.#CURRENT = this.#UI.itemBar
            }
        }

        if (this.#CURRENT && this.#CURRENT.update) {
            this.#CURRENT.update();
        }
    }

    draw(ctx) {
        if (UserInterfaces.displayTitle === true) {
            const _width = ctx.canvas.width * 0.8
            const _height = ctx.canvas.height * 0.2
            ctx.drawImage(ASSET_MANAGER.getImage("ui", "title.png"), (ctx.canvas.width - _width) / 2, ctx.canvas.height * 0.2, _width, _height)
            if (MessageButton.draw(ctx, "Start", ctx.canvas.height * 0.05, ctx.canvas.width * 0.425, ctx.canvas.height * 0.6, undefined, undefined, true) && !Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                Transition.start(() => {
                    if (GAME_ENGINE.saveData && GAME_ENGINE.saveData.player) {
                        GAME_ENGINE.enterLevel(GAME_ENGINE.saveData.player.level)
                    } else {
                        GAME_ENGINE.enterLevel("farm")
                        Level.PLAYER.setMapReference(GAME_ENGINE.getCurrentLevel())
                        GAME_ENGINE.getCurrentLevel().goToSpawn()
                        StoryIntroUI.play('./images/story/story_time.mp4');
                        SaveManager.markVideoAsSeen("intro");
                    }
                    UserInterfaces.displayTitle = false
                })
            }
        } else {
            this.#CURRENT.draw(ctx)
            this.drawMoney(ctx)
            this.drawKarmaBar(ctx)
            EnergyManager.draw(ctx)
            QuestUI.draw(ctx)

            // Achievement Button below Quests
            const btnText = "🏆 Awards [X]";
            ctx.font = "bold 15px 'Outfit', 'Inter', 'Segoe UI', sans-serif";
            const btnW = ctx.measureText(btnText).width + 44; // 22*2 padding
            const btnX = ctx.canvas.width - 5 - btnW; // Align with Quests (5 padding)
            const btnY = 118; 
            if (MessageButton.draw(ctx, btnText, 15, btnX, btnY, 22, 11, true)) {
                if (Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) {
                    if (AchievementManager.isGalleryOpen || Level.PLAYER.notDisablePlayerController()) {
                        AchievementManager.isGalleryOpen = !AchievementManager.isGalleryOpen;
                    }
                }
            }

            AchievementManager.draw(ctx)
            LetterUI.draw(ctx)
            if (AchievementManager.isGalleryOpen) AchievementManager.drawGallery(ctx)
            
            this.drawBackpackButton(ctx)
        }

    }

    drawBackpackButton(ctx) {
        if (!Level.PLAYER) return;
        const fontSize = 28;
        const padding = 15;
        // Positioned at bottom right
        const btnX = ctx.canvas.width - 80;
        const btnY = ctx.canvas.height - 80;
        
        if (MessageButton.draw(ctx, "🎒", fontSize, btnX, btnY, padding, padding, true)) {
            if (Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) {
                // Toggle inventory if player is not disabled
                if (this.#UI.inventory.isOpening || Level.PLAYER.notDisablePlayerController()) {
                    this.#UI.inventory.isOpening = !this.#UI.inventory.isOpening;
                    Controller.mouse.leftClick = false; // Prevent multiple clicks in one frame
                }
            }
        }
    }

    drawMoney(ctx) {
        if (!Level.PLAYER) return;
        const money = Level.PLAYER.getMoney();
        const moneyStr = `${money}`;
        const padding = 20;
        const iconSize = 28;
        
        ctx.save();
        
        // 0. Calculate precise text width to avoid overlap
        ctx.font = "bold 24px Verdana";
        const textMetrics = ctx.measureText(moneyStr);
        const textWidth = textMetrics.width;
        
        // Dynamic box width based on measured text
        // Left Padding (15) + Coin Space (iconSize) + Middle Gap (15) + Text Space (textWidth) + Right Padding (20)
        const boxWidth = Math.max(140, 50 + iconSize + textWidth);
        const boxHeight = 45;
        const x = ctx.canvas.width - padding - boxWidth;
        const y = padding;

        // 1. Draw Outer Glow / Background Shadow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        
        // 2. Main Background (Amber & Cream - No Shadows)
        const bgGradient = ctx.createLinearGradient(x, y, x, y + boxHeight);
        bgGradient.addColorStop(0, "rgba(255, 245, 190, 0.95)");
        bgGradient.addColorStop(1, "rgba(255, 220, 140, 0.95)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, boxWidth, boxHeight, 15);
        } else {
            ctx.rect(x, y, boxWidth, boxHeight);
        }
        ctx.fill();

        // 3. Soft Amber Border (Clean edge)
        ctx.shadowBlur = 0; 
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(255, 180, 0, 0.55)"; 
        ctx.stroke();
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.stroke();

        // 4. Draw Gold Coin icon
        const coinX = x + 15 + iconSize / 2;
        const coinY = y + boxHeight / 2;
        const coinRadius = iconSize / 2;

        // Coin Shadow
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowOffsetY = 2;

        // Coin Body Gradient
        const coinGradient = ctx.createRadialGradient(coinX - 4, coinY - 4, 2, coinX, coinY, coinRadius);
        coinGradient.addColorStop(0, "#fff59d"); // Shimmer / highlight
        coinGradient.addColorStop(0.3, "#ffeb3b"); // Bright gold
        coinGradient.addColorStop(1, "#f57f17"); // Deep gold / orange-ish
        
        ctx.fillStyle = coinGradient;
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinRadius, 0, Math.PI * 2);
        ctx.fill();

        // Coin Rim
        ctx.strokeStyle = "#ffb300";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Coin Shine Reflect (The "Premium" touch)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinRadius * 0.7, -Math.PI * 0.7, -Math.PI * 0.3);
        ctx.stroke();

        // Inner '$' detail
        ctx.fillStyle = "#8d6e63"; // Darker brown for contrast on gold
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 16px 'Trebuchet MS', sans-serif";
        ctx.fillText("$", coinX, coinY + 1);

        // 5. Render Money Text
        const textX = x + boxWidth - 15; // Position at the far right of the box
        const textY = y + boxHeight / 2 + 8;
        
        // Text Shadow / Glow
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        
        // Set alignment to right so the text grows to the left
        ctx.textAlign = "right";
        
        // Use Font class but with the calculated persistent alignment
        Font.draw(ctx, moneyStr, 24, textX, textY, "#ffffff", "rgba(0,0,0,0.4)", "Verdana", "bold", true);

        ctx.restore();
    }

    drawKarmaBar(ctx) {
        if (!Level.PLAYER) return;
        const karma = Level.PLAYER.getKarma();
        const maxKarma = 100;
        const progress = Math.min(karma / maxKarma, 1);
        
        const padding = 20;
        const barWidth = 300;
        const barHeight = 26;
        const x = (ctx.canvas.width - barWidth) / 2;
        const y = padding;
        
        ctx.save();
        
        // 1. Label / Icon
        const labelText = "GOOD DEEDS";
        ctx.font = "bold 14px 'Trebuchet MS', Verdana, sans-serif";
        
        // Draw Label Shadow for visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(labelText, x + barWidth / 2 + 15, y - 10);

        // Draw small Heart Icon
        const heartX = x + barWidth / 2 - 45;
        const heartY = y - 15;
        ctx.fillStyle = "#ff5252";
        ctx.beginPath();
        ctx.moveTo(heartX, heartY + 4);
        ctx.bezierCurveTo(heartX, heartY, heartX - 8, heartY, heartX - 8, heartY + 8);
        ctx.bezierCurveTo(heartX - 8, heartY + 12, heartX, heartY + 16, heartX, heartY + 20);
        ctx.bezierCurveTo(heartX, heartY + 16, heartX + 8, heartY + 12, heartX + 8, heartY + 8);
        ctx.bezierCurveTo(heartX + 8, heartY, heartX, heartY, heartX, heartY + 4);
        ctx.fill();

        // 2. Main Container (High Contrast Background)
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        
        // Darker glass background for contrast
        const bgGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        bgGradient.addColorStop(0, "rgba(20, 30, 20, 0.85)");
        bgGradient.addColorStop(1, "rgba(5, 10, 5, 0.95)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barWidth, barHeight, 13);
        else ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Progress Fill (Vibrant Pulse Gradient)
        if (progress > 0) {
            const time = Date.now() / 1000;
            const pulse = Math.abs(Math.sin(time)) * 0.15;
            
            const fillGradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y);
            fillGradient.addColorStop(0, "rgba(67, 160, 71, 0.9)"); // Green
            fillGradient.addColorStop(0.5, "rgba(129, 199, 132, 0.9)"); // Light Green
            fillGradient.addColorStop(1, "rgba(255, 215, 0, 0.95)"); // Golden Tip
            
            ctx.fillStyle = fillGradient;
            ctx.shadowBlur = 12;
            ctx.shadowColor = `rgba(129, 199, 132, ${0.4 + pulse})`;
            
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x + 2, y + 2, (barWidth - 4) * progress, barHeight - 4, 11);
            } else {
                ctx.rect(x + 2, y + 2, (barWidth - 4) * progress, barHeight - 4);
            }
            ctx.fill();
            
            // Glossy Shine
            const shine = ctx.createLinearGradient(x, y, x, y + barHeight * 0.4);
            shine.addColorStop(0, "rgba(255, 255, 255, 0.25)");
            shine.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = shine;
            ctx.fill();
        }

        // 4. Percentage Text Overlay
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Verdana";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Draw subtle text stroke for maximum readability
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeText(`${karma}%`, x + barWidth / 2, y + barHeight / 2);
        ctx.fillText(`${karma}%`, x + barWidth / 2, y + barHeight / 2);

        ctx.restore();
    }

}