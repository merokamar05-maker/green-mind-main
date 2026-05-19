class LetterUI {
    static #current  = null;
    static #phase    = "hidden"; // "hidden" | "slide_in" | "show" | "slide_out"
    static #timer    = 0;

    static showNext() {
        if (this.#phase !== "hidden") return;
        if (!LetterManager.hasPendingLetters()) return;
        this.#current = LetterManager.getNextLetter();
        this.#phase   = "slide_in";
        this.#timer   = 0;
    }

    static isShowing() { return this.#phase !== "hidden"; }

    static update(dt) {
        if (this.#phase === "hidden") {
            // Auto-show if letters pending and no UI is blocking
            if (LetterManager.hasPendingLetters()) this.showNext();
            return;
        }

        this.#timer += dt;

        if (this.#phase === "slide_in" && this.#timer >= 0.4) {
            this.#phase = "show";
            this.#timer = 0;
        } else if (this.#phase === "show") {
            // Wait for click or auto-dismiss after 8s
            if (this.#timer > 8 ||
                (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) ||
                Controller.keys["Space"]) {
                this.#deliverGift();
                this.#phase = "slide_out";
                this.#timer = 0;
                Controller.mouse.leftClick = false;
                Controller.keys["Space"]   = false;
            }
        } else if (this.#phase === "slide_out" && this.#timer >= 0.4) {
            this.#current = null;
            this.#phase   = "hidden";
            this.#timer   = 0;
            // Check for more letters
            if (LetterManager.hasPendingLetters()) {
                setTimeout(() => LetterUI.showNext(), 600);
            }
        }
    }

    static draw(ctx) {
        if (this.#phase === "hidden" || !this.#current) return;

        const progress =
            this.#phase === "slide_in"  ? Math.min(this.#timer / 0.4, 1)  :
            this.#phase === "show"      ? 1                                 :
            Math.max(1 - this.#timer / 0.4, 0);

        const panW = 500, panH = 320;
        const px   = (ctx.canvas.width  - panW) / 2;
        const py   = (ctx.canvas.height - panH) / 2 - (1 - progress) * 60;

        ctx.save();
        ctx.globalAlpha = progress;

        // Backdrop
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Parchment panel
        const bg = ctx.createLinearGradient(px, py, px, py + panH);
        bg.addColorStop(0, "rgba(255,245,210,0.98)");
        bg.addColorStop(1, "rgba(240,220,170,0.98)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, py, panW, panH, 18);
        else ctx.rect(px, py, panW, panH);
        ctx.fill();

        ctx.strokeStyle = "rgba(180,130,50,0.7)";
        ctx.lineWidth   = 2.5;
        ctx.stroke();

        // Envelope icon
        ctx.font         = "42px Segoe UI Emoji";
        ctx.textAlign    = "center";
        ctx.textBaseline = "top";
        ctx.fillText("✉️", px + panW / 2, py + 14);

        // From
        ctx.font         = "bold 15px Segoe UI";
        ctx.fillStyle    = "#8b5e1a";
        ctx.textBaseline = "top";
        ctx.fillText(`رسالة من  ${this.#current.from}`, px + panW / 2, py + 70);

        // Divider
        ctx.strokeStyle = "rgba(180,130,50,0.4)";
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(px + 40, py + 92); ctx.lineTo(px + panW - 40, py + 92);
        ctx.stroke();

        // Message (multi-line)
        ctx.font         = "14px Segoe UI";
        ctx.fillStyle    = "#4a2d00";
        ctx.textBaseline = "top";
        const lines = this.#current.message.split("\n");
        lines.forEach((line, i) => {
            ctx.fillText(line, px + panW / 2, py + 104 + i * 22);
        });

        // Gift
        if (this.#current.gift) {
            const [giftKey, giftAmt] = this.#current.gift;
            const giftY = py + 104 + lines.length * 22 + 16;

            ctx.font         = "bold 13px Segoe UI";
            ctx.fillStyle    = "#5a3a00";
            ctx.textBaseline = "top";

            if (giftKey === "_money_") {
                ctx.fillText(`🎁  هدية: ${giftAmt} عملة ذهبية 💰`, px + panW / 2, giftY);
            } else {
                const name = InventoryItems.NAMES[giftKey] || giftKey;
                ctx.fillText(`🎁  هدية: ${giftAmt}x ${name}`, px + panW / 2, giftY);
            }
        }

        // Click to close
        ctx.font         = "12px Segoe UI";
        ctx.fillStyle    = "rgba(120,80,20,0.7)";
        ctx.textBaseline = "bottom";
        ctx.fillText("[ انقر أو اضغط Space للإغلاق ]", px + panW / 2, py + panH - 10);

        ctx.restore();
    }

    // ── Deliver gift to player ────────────────────────────────────────────
    static #deliverGift() {
        if (!this.#current || !this.#current.gift || !Level.PLAYER) return;
        const [key, amt] = this.#current.gift;
        if (key === "_money_") {
            Level.PLAYER.earnMoney(amt);
        } else {
            Level.PLAYER.obtainItem(key, amt);
        }
        ASSET_MANAGER.playSound("Gravel_hit3.ogg");
    }
}
