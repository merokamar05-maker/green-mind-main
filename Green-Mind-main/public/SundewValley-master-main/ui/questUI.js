class QuestUI {
    static #isOpen  = false;
    static #prevJ   = false;
    static #notif   = null; // { text, timer }

    static toggle() { this.#isOpen = !this.#isOpen; }

    static showNotification(questDesc) {
        this.#notif  = { text: questDesc, timer: 3.5 };
        this.#isOpen = true;
    }

    static update(dt) {
        // Tick managers (detect new in-game day)
        QuestManager.update();
        FriendshipManager.update();

        // Rising-edge toggle with J
        const jDown = !!Controller.keys["KeyJ"];
        if (jDown && !this.#prevJ) this.toggle();
        this.#prevJ = jDown;

        // Mouse click on button check is handled in draw logic via MessageButton return
        
        if (this.#notif) {
            this.#notif.timer -= dt;
            if (this.#notif.timer <= 0) this.#notif = null;
        }
    }

    static draw(ctx) {
        // ── Draw Quest Button below Money Bar ──
        const padding = 20;
        const btnW = 165;
        const btnX = ctx.canvas.width - 10 - btnW; // Reduced from padding (20) to 10
        const btnY = 70; 

        // Use the MessageButton to handle drawing and click detection
        if (MessageButton.draw(ctx, "📋 Quests [J]", 15, btnX, btnY, 22, 11, true)) {
            if (Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) {
                this.toggle();
            }
        }

        // ── Completion notification ──
        if (this.#notif) this.#drawNotif(ctx);

        if (!this.#isOpen) return;

        const quests    = QuestManager.getQuests();
        const completed = QuestManager.getCompleted();
        if (!quests || quests.length === 0) return;

        const QUEST_H = 58, PAD = 8;
        const PW = 268;
        const PH = 40 + quests.length * (QUEST_H + PAD) + 10;
        const PX = 14;
        const PY = (ctx.canvas.height - PH) / 2;

        ctx.save();

        // Panel BG
        ctx.shadowBlur = 18; ctx.shadowColor = "rgba(0,0,0,0.55)";
        const bg = ctx.createLinearGradient(PX, PY, PX, PY + PH);
        bg.addColorStop(0, "rgba(16,36,16,0.95)");
        bg.addColorStop(1, "rgba(8,18,8,0.97)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(PX, PY, PW, PH, 14);
        else ctx.rect(PX, PY, PW, PH);
        ctx.fill();

        // Border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(90,210,90,0.4)"; ctx.lineWidth = 1.5;
        ctx.stroke();

        // Title
        ctx.textAlign = "center";
        ctx.font = "bold 14px Verdana";
        ctx.fillStyle = "#9de89d";
        ctx.fillText("📋  Daily Quests", PX + PW / 2, PY + 26);

        // Divider
        ctx.strokeStyle = "rgba(90,210,90,0.25)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(PX + 14, PY + 34); ctx.lineTo(PX + PW - 14, PY + 34);
        ctx.stroke();

        // Quest items
        quests.forEach((q, i) => {
            this.#drawQuest(ctx, q, PX + 8, PY + 40 + i * (QUEST_H + PAD), PW - 16, QUEST_H, completed.includes(i));
        });

        ctx.restore();
    }

    static #drawQuest(ctx, q, x, y, w, h, done) {
        // Box
        ctx.fillStyle = done ? "rgba(30,70,30,0.55)" : "rgba(25,45,25,0.45)";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, 7);
        else ctx.rect(x, y, w, h);
        ctx.fill();

        if (done) {
            ctx.strokeStyle = "rgba(80,200,80,0.35)"; ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Icon + description
        ctx.textAlign = "left";
        ctx.font = "13px Verdana";
        ctx.fillStyle = done ? "#70c870" : "#d8f0d8";
        ctx.fillText(q.icon + "  " + q.description, x + 8, y + 17);

        if (done) {
            ctx.font = "bold 11px Verdana";
            ctx.fillStyle = "#55ee55";
            ctx.fillText("✓ COMPLETE!", x + 8, y + 35);
        } else {
            // Progress bar
            const bx = x + 8, by = y + 34, bw = w - 16, bh = 9;
            const pct = q.required > 0 ? q.progress / q.required : 0;

            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 4);
            else ctx.rect(bx, by, bw, bh);
            ctx.fill();

            if (pct > 0) {
                const grad = ctx.createLinearGradient(bx, by, bx + bw * pct, by);
                grad.addColorStop(0, "#388e3c"); grad.addColorStop(1, "#a5d6a7");
                ctx.fillStyle = grad;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(bx, by, bw * pct, bh, 4);
                else ctx.rect(bx, by, bw * pct, bh);
                ctx.fill();
            }

            ctx.textAlign = "right";
            ctx.font = "10px Verdana"; ctx.fillStyle = "#8a9";
            ctx.fillText(`${q.progress}/${q.required}`, x + w - 8, y + 32);
        }

        // Reward label
        const r = q.reward;
        const rewardStr = r.money ? `💰 +$${r.money}` : r.karma ? `💚 +${r.karma} karma` : `🌱 +${r.seedAmount} ${r.seeds}`;
        ctx.textAlign = "right";
        ctx.font = "10px Verdana";
        ctx.fillStyle = done ? "#66aa66" : "#e8d840";
        ctx.fillText(rewardStr, x + w - 8, y + h - 6);
    }

    static #drawNotif(ctx) {
        const n = this.#notif;
        const alpha = Math.min(1, n.timer / 0.6);
        const NW = 320, NH = 66;
        const NX = ctx.canvas.width / 2 - NW / 2;
        const NY = 75;

        ctx.save();
        ctx.globalAlpha = alpha;

        // BG
        ctx.shadowBlur = 16; ctx.shadowColor = "rgba(0,200,0,0.25)";
        const bg = ctx.createLinearGradient(NX, NY, NX, NY + NH);
        bg.addColorStop(0, "rgba(20,60,20,0.96)");
        bg.addColorStop(1, "rgba(10,35,10,0.96)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(NX, NY, NW, NH, 12);
        else ctx.rect(NX, NY, NW, NH);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(80,220,80,0.7)"; ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.textAlign = "center";
        ctx.font = "bold 15px Verdana"; ctx.fillStyle = "#88ff88";
        ctx.fillText("✓ Quest Complete!", NX + NW / 2, NY + 24);
        ctx.font = "12px Verdana"; ctx.fillStyle = "#aaddaa";
        // Truncate if too long
        const label = n.text.length > 38 ? n.text.substring(0, 36) + "…" : n.text;
        ctx.fillText(label, NX + NW / 2, NY + 47);

        ctx.restore();
    }
}
