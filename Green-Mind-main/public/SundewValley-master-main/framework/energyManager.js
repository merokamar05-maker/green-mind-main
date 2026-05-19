class EnergyManager {
    static #MAX    = 100;
    static #current = 100;

    // ── Energy values for eating/drinking items ───────────────────────────
    static ENERGY_BY_ITEM = {
        // Cooked food
        "soup": 30, "jam": 20, "stew": 40, "salad": 25, "ratatouille": 35,
        // Raw vegetables
        "pumpkin": 10, "cabbage": 8, "carrot": 8, "grain": 5, "potato": 10,
        "strawberry": 12, "tomato": 8, "eggplant": 10, "corn": 12, "pea": 5,
        // Drinks
        "medicinal_juice": 40, "water": 10, "orange_juice": 25, "apple_juice": 25, "pineapple_juice": 30
    };

    // ── Queries ──────────────────────────────────────────────────────────
    static getMax()        { return this.#MAX; }
    static get()           { return this.#current; }
    static isExhausted()   { return this.#current <= 0; }
    static getFraction()   { return EnergyManager.#current / EnergyManager.#MAX; }

    // ── Mutators ─────────────────────────────────────────────────────────
    /** Returns true if energy was available and was consumed, false if exhausted. */
    static consume(amount) {
        if (EnergyManager.#current <= 0) return false;
        const old = EnergyManager.#current;
        EnergyManager.#current = Math.max(0, EnergyManager.#current - amount);
        if (old !== EnergyManager.#current) {
             console.log("Energy changed from", old, "to", EnergyManager.#current);
        }
        return true;
    }

    static restore(amount) {
        this.#current = Math.min(this.#MAX, this.#current + amount);
    }

    static restoreFull() {
        this.#current = this.#MAX;
    }

    // ── Save / Load ───────────────────────────────────────────────────────
    static getSaveData()   { return { energy: this.#current }; }

    static loadSaveData(data) {
        if (data && data.energy != null) this.#current = data.energy;
    }

    // ── HUD Drawing ───────────────────────────────────────────────────────
    /**
     * Draws the energy bar in the top-right corner, below the money bar.
     * Call this every frame from UserInterfaces.draw().
     */
    static draw(ctx) {
        if (!Level.PLAYER) return;

        const padding    = 20;
        const barW       = 160;
        const barH       = 18;
        const iconSize   = 22;
        const boxH       = barH + 16;
        const boxW       = barW + iconSize + 18;

        // Position next to money bar
        // Money bar is typically at x = canvas.width - padding - 180, y = 20
        // We'll put energy bar to the left of it.
        const moneyBoxWidthEstimate = 180;
        const x = ctx.canvas.width - padding - moneyBoxWidthEstimate - boxW - 10;
        const y = padding; 

        ctx.save();

        // Background pill
        const bg = ctx.createLinearGradient(x, y, x, y + boxH);
        bg.addColorStop(0, "rgba(30,30,60,0.85)");
        bg.addColorStop(1, "rgba(10,10,30,0.85)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, boxW, boxH, 10);
        else ctx.rect(x, y, boxW, boxH);
        ctx.fill();

        ctx.strokeStyle = "rgba(100,120,255,0.4)";
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Lightning icon ⚡
        ctx.font      = `bold ${iconSize - 4}px Segoe UI Emoji`;
        ctx.fillStyle = this.#current <= 20 ? "#ff4444" : "#ffe066";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚡", x + 14, y + boxH / 2);

        // Bar track
        const bx = x + iconSize + 6;
        const by = y + (boxH - barH) / 2;

        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, barW, barH, barH / 2);
        else ctx.rect(bx, by, barW, barH);
        ctx.fill();

        // Bar fill
        const fillFrac  = this.getFraction();
        const fillColor = fillFrac > 0.5 ? "#66ff88"
                        : fillFrac > 0.25 ? "#ffdd44"
                        : "#ff4444";
        const grad = ctx.createLinearGradient(bx, by, bx, by + barH);
        grad.addColorStop(0, fillColor);
        grad.addColorStop(1, fillColor + "aa");
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, barW * fillFrac, barH, barH / 2);
        else ctx.rect(bx, by, barW * fillFrac, barH);
        ctx.fill();

        // Numeric text inside bar (Enhanced visibility)
        const currentVal = Math.ceil(EnergyManager.get());
        ctx.font      = "bold 15px 'Outfit', 'Inter', 'Segoe UI', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        
        // Shadow for text depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 4;
        ctx.fillText(`${currentVal} / ${EnergyManager.getMax()}`, bx + barW / 2, by + barH / 2);
        ctx.shadowBlur = 0;

        // Key hint under the bar
        ctx.font = "bold 12px 'Trebuchet MS', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.textAlign = "center";
        ctx.fillText("[R] Eat to Restore", bx + barW / 2, by + barH + 15);

        // "EXHAUSTED" pulsing warning overlay
        if (this.#current <= 0) {
            const pulse = 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 400));
            ctx.save();
            ctx.globalAlpha = pulse;
            // Full-screen dark vignette hint
            ctx.fillStyle = "rgba(255,0,0,0.08)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Central warning message
            const msgW = 420, msgH = 68;
            const mx = (ctx.canvas.width - msgW) / 2;
            const my = ctx.canvas.height * 0.38;
            const msgBg = ctx.createLinearGradient(mx, my, mx, my + msgH);
            msgBg.addColorStop(0, "rgba(80,0,0,0.95)");
            msgBg.addColorStop(1, "rgba(30,0,0,0.95)");
            ctx.fillStyle = msgBg;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(mx, my, msgW, msgH, 14);
            else ctx.rect(mx, my, msgW, msgH);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,80,80,0.8)";
            ctx.lineWidth   = 2;
            ctx.stroke();

            ctx.fillStyle    = "#ffeeee";
            ctx.font         = "bold 22px Segoe UI";
            ctx.textAlign    = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("😴  Too tired!  Go to bed to rest...", mx + msgW / 2, my + msgH / 2);
            ctx.restore();
        }

        ctx.restore();
    }
}
