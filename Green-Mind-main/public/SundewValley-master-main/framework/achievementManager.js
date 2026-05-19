class AchievementManager {
    static #DEFS = {
        first_harvest:  { title: "First Harvest!",     desc: "Harvested your first crop",          icon: "🌱", target: 1,   reward: { money: 100 } },
        green_thumb:    { title: "Green Thumb",        desc: "Harvested 50 crops",                 icon: "🌾", target: 50,  reward: { money: 500, items: [{ key: "pumpkin_seed", count: 5 }] } },
        master_farmer:  { title: "Master Farmer",      desc: "Harvested 200 crops",                icon: "🚜", target: 200, reward: { money: 2000, items: [{ key: "carrot_seed", count: 10 }] } },
        friendly_face:  { title: "Friendly Face",      desc: "Reached 3 hearts with an NPC",       icon: "🤝", target: 3,   reward: { money: 300 } },
        best_friends:   { title: "Best Friends",       desc: "Reached 10 hearts with an NPC",      icon: "💕", target: 10,  reward: { money: 1000, items: [{ key: "medicinal_juice", count: 1 }] } },
        eco_warrior:    { title: "Eco Warrior",        desc: "Recycled 10 trash bags",             icon: "♻️", target: 10,  reward: { money: 200, items: [{ key: "cabbage_seed", count: 5 }] } },
        rich_farmer:    { title: "Rich Farmer",        desc: "Accumulated 5,000 coins",            icon: "💰", target: 5000, reward: { money: 500 } },
        daily_hero:     { title: "Daily Hero",         desc: "Completed all 3 daily quests",       icon: "📋", target: 1,   reward: { money: 400, items: [{ key: "apple_juice", count: 2 }] } },
        animal_lover:   { title: "Animal Lover",       desc: "Caught 3 escaped animals",           icon: "🐄", target: 3,   reward: { money: 600, items: [{ key: "chicken", count: 1 }] } },
        early_bird:     { title: "Early Bird",         desc: "Went to sleep before 22:00",         icon: "😴", target: 1,   reward: { money: 100 } },
        juice_lover:    { title: "Juice Lover",        desc: "Drank 5 juices",                     icon: "🍹", target: 5,   reward: { money: 500, items: [{ key: "orange_juice", count: 3 }] } },
        legend:         { title: "Legend!",            desc: "Unlocked 10 other achievements",     icon: "⭐", target: 10,  reward: { money: 5000 } }
    };

    static #state = { lastResetTimestamp: Date.now() };
    static #queue = [];
    static #showing = null;
    static #timer = 0;
    static isGalleryOpen = false;
    static RESET_INTERVAL_HOURS = 24; 

    static notify(id, amount = 1, isAbsolute = false) {
        const def = this.#DEFS[id];
        if (!def) return;
        const s = this.#state[id] || (this.#state[id] = { progress: 0, unlocked: false });
        if (s.unlocked) return;
        
        if (isAbsolute) s.progress = amount;
        else s.progress += amount;
        console.log(`[Achievement] ${id} progress: ${s.progress}/${def.target}`);

        if (s.progress >= def.target) {
            s.unlocked = true;
            s.progress = def.target;
            this.#queue.push({ ...def, id });
            console.log(`[Achievement] ${id} UNLOCKED!`);
            this.grantReward(id);
            
            // Update Legend achievement progress
            if (id !== "legend") {
                const unlockedCount = Object.values(this.#state).filter(st => st.unlocked && st !== this.#state["legend"]).length;
                const sLegend = this.#state["legend"] || (this.#state["legend"] = { progress: 0, unlocked: false });
                if (!sLegend.unlocked) {
                    sLegend.progress = unlockedCount;
                    if (sLegend.progress >= this.#DEFS["legend"].target) {
                        this.notify("legend", 0); // Trigger unlock
                    }
                }
            }
        }
    }

    static grantReward(id) {
        const def = this.#DEFS[id];
        if (!def || !def.reward) return;
        const player = Level.PLAYER;
        if (!player) {
            console.warn(`[Achievement] Could not grant reward for ${id}: Player not found`);
            return;
        }

        console.log(`[Achievement] Granting reward for ${id}:`, def.reward);
        if (def.reward.money) {
            player.earnMoney(def.reward.money);
        }
        if (def.reward.items) {
            def.reward.items.forEach(item => {
                player.obtainItem(item.key, item.count);
            });
        }
        ASSET_MANAGER.playSound("Gravel_hit3.ogg");
    }

    static notifyHarvest()      { this.notify("first_harvest"); this.notify("green_thumb"); this.notify("master_farmer"); }
    static notifyFriendship(h)  { this.notify("friendly_face", h, true); this.notify("best_friends", h, true); }
    static notifyRecycle(n)     { this.notify("eco_warrior", n); }
    static notifyMoney(c)       { this.notify("rich_farmer", c, true); }
    static notifyQuestsAll()    { this.notify("daily_hero"); }
    static notifyAnimalCaught() { this.notify("animal_lover"); }
    static notifyEarlyBird()    { this.notify("early_bird"); }
    static notifyDrink()        { this.notify("juice_lover"); }

    static checkFriendshipAchievements() {
        if (typeof FriendshipManager === "undefined") return;
        const data = FriendshipManager.getSaveData();
        const points = data.points || {};
        let maxHearts = 0;
        Object.keys(points).forEach(name => {
            const h = Math.floor(points[name] / 10);
            maxHearts = Math.max(maxHearts, h);
        });
        this.notifyFriendship(maxHearts);
    }

    static update(dt) {
        this.checkDailyReset(); 
        this.checkFriendshipAchievements(); // Keep synced
        if (!this.#showing && this.#queue.length > 0) {
            this.#showing = this.#queue.shift();
            this.#timer = 4.0;
        }
        if (this.#showing) {
            this.#timer -= dt;
            if (this.#timer <= 0) this.#showing = null;
        }
    }

    static draw(ctx) {
        if (!this.#showing) return;
        const a = this.#showing;
        const slide = Math.min(1, (4.0 - this.#timer) / 0.3);
        const fade  = this.#timer < 0.5 ? this.#timer / 0.5 : 1;
        const boxW = 340, boxH = 95; // Increased height for reward text
        const bx = ctx.canvas.width / 2 - boxW / 2;
        const by = 16 - (1 - slide) * (boxH + 16);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.fillStyle = "rgba(20,20,40,0.95)";
        if (ctx.roundRect) ctx.roundRect(bx, by, boxW, boxH, 15); else ctx.rect(bx, by, boxW, boxH);
        ctx.fill();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = "32px Segoe UI Emoji";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(a.icon, bx + 15, by + boxH / 2);
        
        ctx.font = "bold 11px Segoe UI";
        ctx.fillStyle = "#ffd700";
        ctx.fillText("🏆 ACHIEVEMENT UNLOCKED!", bx + 60, by + 18);
        
        ctx.font = "bold 16px Segoe UI";
        ctx.fillStyle = "#fff";
        ctx.fillText(a.title, bx + 60, by + 36);
        
        ctx.font = "12px Segoe UI";
        ctx.fillStyle = "#aaa";
        ctx.fillText(a.desc, bx + 60, by + 54);

        // Draw Reward Info
        if (a.reward) {
            let rewardText = "🎁 Reward: ";
            if (a.reward.money) rewardText += `${a.reward.money} Coins `;
            if (a.reward.items) {
                a.reward.items.forEach(it => {
                    const itemName = InventoryItems.NAMES[it.key] || it.key;
                    rewardText += `+ ${it.count}x ${itemName} `;
                });
            }
            ctx.font = "bold 12px Segoe UI";
            ctx.fillStyle = "#00ff88";
            ctx.fillText(rewardText, bx + 60, by + 74);
        }
        
        ctx.restore();
    }

    static drawGallery(ctx) {
        const all = Object.entries(this.#DEFS);
        const cols = 3;
        const rows = Math.ceil(all.length / cols);
        const cardW = 380, cardH = 130, gap = 15; // Increased card height
        const totalW = cols * cardW + (cols - 1) * gap;
        const totalH = rows * cardH + (rows - 1) * gap;
        const startX = (ctx.canvas.width - totalW) / 2;
        const startY = (ctx.canvas.height - totalH) / 2 + 30;

        ctx.save();
        ctx.fillStyle = "rgba(0,0,10,0.96)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.font = "bold 42px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffd700";
        ctx.shadowColor = "rgba(255,215,0,0.4)";
        ctx.shadowBlur = 20;
        ctx.fillText("🏆  ACHIEVEMENTS  🏆", ctx.canvas.width / 2, startY - 80);
        ctx.shadowBlur = 0;

        all.forEach(([id, def], i) => {
            const s = this.#state[id] || { progress: 0, unlocked: false };
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = startX + col * (cardW + gap);
            const cy = startY + row * (cardH + gap);
            const unlocked = s.unlocked;

            ctx.save();
            const bg = ctx.createLinearGradient(cx, cy, cx, cy + cardH);
            if (unlocked) {
                bg.addColorStop(0, "#2d3a1a"); bg.addColorStop(1, "#1a2510");
                ctx.shadowBlur = 15; ctx.shadowColor = "rgba(255,215,0,0.2)";
            } else {
                bg.addColorStop(0, "#1a1a2e"); bg.addColorStop(1, "#12121f");
            }
            ctx.fillStyle = bg;
            ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx, cy, cardW, cardH, 15); else ctx.rect(cx, cy, cardW, cardH);
            ctx.fill();
            ctx.strokeStyle = unlocked ? "#ffd700" : "rgba(255,255,255,0.1)";
            ctx.lineWidth = unlocked ? 2.5 : 1;
            ctx.stroke();

            ctx.font = "32px Segoe UI Emoji";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = unlocked ? 1 : 0.2;
            ctx.fillText(def.icon, cx + 45, cy + cardH / 2);

            ctx.globalAlpha = 1;
            ctx.textAlign = "left";
            ctx.font = "bold 16px Segoe UI";
            ctx.fillStyle = unlocked ? "#ffd700" : "#888";
            ctx.fillText(def.title, cx + 85, cy + 30);
            ctx.font = "13px Segoe UI";
            ctx.fillStyle = unlocked ? "#fff" : "#555";
            ctx.fillText(def.desc, cx + 85, cy + 50);

            // Reward info in gallery
            if (def.reward) {
                let rewardText = "Reward: ";
                if (def.reward.money) rewardText += `${def.reward.money} Coins `;
                if (def.reward.items) {
                    def.reward.items.forEach(it => {
                         const itemName = InventoryItems.NAMES[it.key] || it.key;
                         rewardText += `+ ${it.count} ${itemName} `;
                    });
                }
                ctx.font = "italic 11px Segoe UI";
                ctx.fillStyle = unlocked ? "#00ff88" : "#447755";
                ctx.fillText(rewardText, cx + 85, cy + 70);
            }

            if (unlocked) {
                ctx.font = "bold 11px Segoe UI";
                ctx.fillStyle = "#00ff88";
                ctx.textAlign = "right";
                ctx.fillText("UNLOCKED ✓", cx + cardW - 15, cy + cardH - 15);
            } else {
                const frac = Math.min(s.progress / def.target, 1);
                ctx.fillStyle = "rgba(255,255,255,0.05)";
                ctx.fillRect(cx + 85, cy + 85, cardW - 105, 5);
                ctx.fillStyle = "#ffd700";
                ctx.fillRect(cx + 85, cy + 85, (cardW - 105) * frac, 5);
                
                ctx.font = "10px Segoe UI";
                ctx.fillStyle = "#888";
                ctx.textAlign = "right";
                ctx.fillText(`${s.progress} / ${def.target}`, cx + cardW - 20, cy + 100);
            }
            ctx.restore();
        });

        // Close Text-only Button
        const btnText = "CLOSE GALLERY [X]";
        ctx.font = "bold 16px Segoe UI";
        const tw = ctx.measureText(btnText).width;
        const tx = (ctx.canvas.width - tw) / 2;
        const ty = ctx.canvas.height - 40;
        
        const isHover = Controller.mouse.x > tx - 10 && Controller.mouse.x < tx + tw + 10 &&
                        Controller.mouse.y > ty - 20 && Controller.mouse.y < ty + 10;
        
        ctx.fillStyle = isHover ? "#fff" : "rgba(255,215,0,0.7)";
        ctx.textAlign = "left";
        ctx.fillText(btnText, tx, ty);
        
        // Underline on hover
        if (isHover) {
            ctx.fillRect(tx, ty + 4, tw, 2);
            if (Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) {
                this.isGalleryOpen = false;
                Controller.mouse.leftClick = false;
            }
        }
        ctx.restore();
    }

    static getSaveData()   { return JSON.parse(JSON.stringify(this.#state)); }
    static loadSaveData(d) {
        if (!d) return;
        this.#state = d;
        if (!this.#state.lastResetTimestamp) this.#state.lastResetTimestamp = Date.now();
        this.checkDailyReset();
    }

    static getUnlockedCount() {
        return Object.values(this.#state).filter(s => s && s.unlocked).length;
    }

    static checkDailyReset() {
        const now = Date.now();
        const diffMs = now - this.#state.lastResetTimestamp;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        if (diffHours >= this.RESET_INTERVAL_HOURS) {
            console.log(`[Achievement] ${this.RESET_INTERVAL_HOURS}h passed. Resetting achievements!`);
            this.resetAllAchievements();
            this.#state.lastResetTimestamp = now;
        }
    }

    static resetAllAchievements() {
        const oldTimestamp = this.#state.lastResetTimestamp;
        this.#state = { lastResetTimestamp: oldTimestamp };
        // We could notify the user here if we wanted
    }
}
