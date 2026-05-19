class RecipeUI {
    static isOpen = false;
    static #selectedSlot = -1;

    static open()  { this.isOpen = true;  this.#selectedSlot = -1; }
    static close() { this.isOpen = false; }

    static update() {
        if (!this.isOpen) return;
        if (Controller.keys["Escape"] || Controller.keys["KeyK"]) {
            this.close();
            Controller.keys["Escape"] = false;
            Controller.keys["KeyK"]   = false;
        }
    }

    static draw(ctx) {
        if (!this.isOpen) return;
        const recipes = RecipeManager.RECIPES;
        const player  = Level.PLAYER;

        // ── Overlay ──────────────────────────────────────────────────────
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // ── Panel ────────────────────────────────────────────────────────
        const panW = 560, panH = 420;
        const px   = (ctx.canvas.width  - panW) / 2;
        const py   = (ctx.canvas.height - panH) / 2;

        const panBg = ctx.createLinearGradient(px, py, px, py + panH);
        panBg.addColorStop(0, "rgba(30,18,10,0.98)");
        panBg.addColorStop(1, "rgba(18,10,5,0.98)");
        ctx.fillStyle = panBg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, py, panW, panH, 20);
        else ctx.rect(px, py, panW, panH);
        ctx.fill();

        ctx.strokeStyle = "rgba(200,140,40,0.6)";
        ctx.lineWidth   = 2.5;
        ctx.stroke();

        // ── Title ────────────────────────────────────────────────────────
        ctx.font         = "bold 22px Segoe UI";
        ctx.fillStyle    = "#ffd700";
        ctx.textAlign    = "center";
        ctx.textBaseline = "top";
        ctx.fillText("🍳  Kitchen — Recipes", px + panW / 2, py + 18);

        ctx.font      = "13px Segoe UI";
        ctx.fillStyle = "rgba(200,180,130,0.7)";
        ctx.fillText("Click a recipe to cook it  •  R to eat food  •  ESC to close", px + panW / 2, py + 48);

        // ── Recipe Cards ─────────────────────────────────────────────────
        const cols = 3, cardW = 160, cardH = 120, gapX = 12, gapY = 10;
        const gridX = px + (panW - (cols * cardW + (cols - 1) * gapX)) / 2;
        const gridY = py + 78;

        let hovered = -1;

        recipes.forEach((r, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx  = gridX + col * (cardW + gapX);
            const cy  = gridY + row * (cardH + gapY);
            const canCraft = RecipeManager.canCraft(r, player);

            const isHov = Controller.mouse.x >= cx && Controller.mouse.x <= cx + cardW &&
                          Controller.mouse.y >= cy && Controller.mouse.y <= cy + cardH;
            if (isHov) hovered = i;

            // Card bg
            const cardBg = ctx.createLinearGradient(cx, cy, cx, cy + cardH);
            if (canCraft) {
                cardBg.addColorStop(0, isHov ? "rgba(80,60,20,0.98)" : "rgba(55,40,12,0.95)");
                cardBg.addColorStop(1, isHov ? "rgba(50,35,10,0.98)" : "rgba(35,22,6,0.95)");
            } else {
                cardBg.addColorStop(0, "rgba(30,30,35,0.9)");
                cardBg.addColorStop(1, "rgba(20,20,25,0.9)");
            }
            ctx.fillStyle = cardBg;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(cx, cy, cardW, cardH, 12);
            else ctx.rect(cx, cy, cardW, cardH);
            ctx.fill();

            ctx.strokeStyle = canCraft
                ? (isHov ? "rgba(255,215,0,0.9)" : "rgba(200,160,40,0.5)")
                : "rgba(80,80,90,0.4)";
            ctx.lineWidth   = isHov ? 2.5 : 1.5;
            ctx.stroke();

            // ── Cartoon food icon (canvas-drawn) ─────────────────────────
            this.#drawFoodIcon(ctx, r, cx + cardW / 2, cy + 36, 36, canCraft);

            // Name
            ctx.font         = `bold 12px Segoe UI`;
            ctx.fillStyle    = canCraft ? "#ffeebb" : "#888890";
            ctx.textAlign    = "center";
            ctx.textBaseline = "top";
            ctx.fillText(r.name, cx + cardW / 2, cy + 76);

            // Ingredients
            ctx.font      = "10px Segoe UI";
            ctx.fillStyle = canCraft ? "rgba(200,200,150,0.85)" : "rgba(120,120,130,0.7)";
            ctx.fillText(r.ingredients.join(" + "), cx + cardW / 2, cy + 92);

            // Energy
            ctx.font      = "bold 10px Segoe UI";
            ctx.fillStyle = canCraft ? "#66ff88" : "#558855";
            ctx.fillText(`⚡ +${r.energy}`, cx + cardW / 2, cy + 106);

            // Can't cook overlay
            if (!canCraft) {
                ctx.save();
                ctx.globalAlpha = 0.35;
                ctx.fillStyle   = "#000";
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(cx, cy, cardW, cardH, 12);
                else ctx.rect(cx, cy, cardW, cardH);
                ctx.fill();
                ctx.restore();
                ctx.font         = "bold 11px Segoe UI";
                ctx.fillStyle    = "rgba(255,100,100,0.9)";
                ctx.textAlign    = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Missing ingredients", cx + cardW / 2, cy + cardH / 2);
            }
        });

        // ── Click to craft ────────────────────────────────────────────────
        if (hovered >= 0 && !Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
            const r = recipes[hovered];
            if (RecipeManager.canCraft(r, player)) {
                RecipeManager.craft(r, player);
                Controller.mouse.leftClick = false;
            }
        }

        // Close button
        ctx.font         = "13px Segoe UI";
        ctx.fillStyle    = "rgba(180,140,60,0.8)";
        ctx.textAlign    = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("[ ESC ] Close", px + panW / 2, py + panH - 10);

        ctx.restore();
    }

    // ── Cartoon food drawing ──────────────────────────────────────────────
    static #drawFoodIcon(ctx, recipe, cx, cy, r, bright) {
        ctx.save();
        const alpha = bright ? 1 : 0.4;
        ctx.globalAlpha = alpha;

        switch (recipe.id) {
            case "soup": {
                // Bowl
                ctx.fillStyle = "#8b4513";
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.3, r * 0.9, r * 0.55, 0, 0, Math.PI); ctx.fill();
                // Soup surface
                ctx.fillStyle = "#e67e22";
                ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.1, r * 0.85, r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
                // Steam
                for (let s = -1; s <= 1; s++) {
                    ctx.strokeStyle = "rgba(200,200,200,0.5)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(cx + s * 12, cy - r * 0.5);
                    ctx.quadraticCurveTo(cx + s * 12 + 6, cy - r * 0.8, cx + s * 12, cy - r * 1.1);
                    ctx.stroke();
                }
                break;
            }
            case "jam": {
                // Jar body
                ctx.fillStyle = "#e74c3c";
                ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx - r * 0.7, cy - r * 0.5, r * 1.4, r, 6); else ctx.rect(cx - r * 0.7, cy - r * 0.5, r * 1.4, r); ctx.fill();
                // Lid
                ctx.fillStyle = "#c0392b";
                ctx.fillRect(cx - r * 0.6, cy - r * 0.65, r * 1.2, r * 0.2);
                // Strawberry icon on jar
                ctx.fillStyle = "#ff9999";
                ctx.font      = `${r * 0.7}px Segoe UI Emoji`;
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText("🍓", cx, cy + r * 0.05);
                break;
            }
            case "stew": {
                // Pot
                ctx.fillStyle = "#5d3a1a";
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.25, r, r * 0.6, 0, 0, Math.PI); ctx.fill();
                ctx.fillStyle = "#8b6914";
                ctx.fillRect(cx - r, cy - r * 0.3, r * 2, r * 0.55);
                // Handles
                ctx.strokeStyle = "#5d3a1a"; ctx.lineWidth = 5;
                ctx.beginPath(); ctx.arc(cx - r, cy - r * 0.05, r * 0.25, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx + r, cy - r * 0.05, r * 0.25, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
                // Stew surface
                ctx.fillStyle = "#d4a05a";
                ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.3, r * 0.85, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
                break;
            }
            case "salad": {
                // Bowl
                ctx.fillStyle = "#7dbb7d";
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.2, r * 0.9, r * 0.5, 0, 0, Math.PI); ctx.fill();
                // Rim
                ctx.strokeStyle = "#4a9a4a"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.1, r * 0.9, r * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
                // Lettuce leaves
                const leafColors = ["#33cc33", "#22aa22", "#55dd55"];
                for (let l = 0; l < 5; l++) {
                    const angle = (l / 5) * Math.PI * 2;
                    ctx.fillStyle = leafColors[l % 3];
                    ctx.beginPath(); ctx.ellipse(cx + Math.cos(angle) * r * 0.4, cy - r * 0.1 + Math.sin(angle) * r * 0.2, r * 0.3, r * 0.18, angle, 0, Math.PI * 2); ctx.fill();
                }
                break;
            }
            case "ratatouille": {
                // Plate
                ctx.fillStyle = "#f5f5f5";
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.1, r, r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2; ctx.stroke();
                // Vegetable slices
                const cols2 = ["#9b59b6", "#e74c3c", "#e67e22"];
                for (let v = 0; v < 3; v++) {
                    ctx.fillStyle = cols2[v];
                    ctx.beginPath(); ctx.ellipse(cx + (v - 1) * r * 0.5, cy, r * 0.28, r * 0.36, v * 0.3, 0, Math.PI * 2); ctx.fill();
                }
                break;
            }
        }
        ctx.restore();
    }
}
