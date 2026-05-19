class QuestManager {
    static #currentDay = -1;
    static #quests = [];
    static #completed = [];

    static #CROPS = ["tomato", "carrot", "pumpkin", "strawberry", "corn", "potato", "cabbage", "eggplant"];
    static #NPCS  = ["Mimo", "Mohamed", "Maryoma", "Grandmother", "Maya", "Zozo", "Sebaey"];
    static #TYPES = ["harvest", "talk", "trash", "sell"];

    static #rand(seed) {
        const x = Math.sin(seed + 1) * 10000;
        return x - Math.floor(x);
    }

    static #createQuest(type, seed) {
        switch (type) {
            case "harvest": {
                const crop = this.#CROPS[seed % this.#CROPS.length];
                const amt  = 2 + (seed % 3);
                return { type, icon: "🌾", description: `Harvest ${amt} ${crop}`, target: crop, required: amt, progress: 0, reward: { money: amt * 60 } };
            }
            case "talk": {
                const npc = this.#NPCS[seed % this.#NPCS.length];
                return { type, icon: "💬", description: `Talk to ${npc}`, target: npc, required: 1, progress: 0, reward: { seeds: "carrot_seed", seedAmount: 3 } };
            }
            case "trash": {
                const amt = 2 + (seed % 3);
                return { type, icon: "♻️", description: `Recycle ${amt} trash bags`, target: "trash", required: amt, progress: 0, reward: { karma: 25 } };
            }
            case "sell": {
                const amt = 3 + (seed % 3);
                return { type, icon: "🛒", description: `Sell ${amt} items`, target: "any", required: amt, progress: 0, reward: { money: amt * 40 } };
            }
        }
    }

    static #generateForDay(day) {
        const types = [...this.#TYPES];
        // Seeded Fisher-Yates shuffle
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(this.#rand(day * 31 + i) * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        return [0, 1, 2].map(i => this.#createQuest(types[i], Math.floor(this.#rand(day * 97 + i * 13) * 1000)));
    }

    static update() {
        const today = DateTimeSystem.getTotalDays();
        if (today !== this.#currentDay) {
            this.#currentDay = today;
            this.#quests    = this.#generateForDay(today);
            this.#completed = [];
            console.log("[QuestManager] New day – quests:", this.#quests.map(q => q.description));
        }
    }

    static getQuests()    { return this.#quests; }
    static getCompleted() { return this.#completed; }

    static #tryComplete(i) {
        if (this.#completed.includes(i)) return;
        this.#completed.push(i);
        const q = this.#quests[i];
        if (q.reward.money)  Level.PLAYER.earnMoney(q.reward.money);
        if (q.reward.karma)  Level.PLAYER.addKarma(q.reward.karma);
        if (q.reward.seeds)  Level.PLAYER.obtainItem(q.reward.seeds, q.reward.seedAmount || 1);
        console.log(`[QuestManager] ✓ "${q.description}" complete!`, q.reward);
        if (typeof QuestUI !== "undefined") QuestUI.showNotification(q.description);

        // Achievement: Daily Hero (3 quests)
        if (this.#completed.length >= 3 && typeof AchievementManager !== "undefined") {
            AchievementManager.notifyQuestsAll();
        }
    }

    static #advance(type, target, amount = 1) {
        this.#quests.forEach((q, i) => {
            if (q.type !== type || this.#completed.includes(i)) return;
            if (target && q.target !== target && q.target !== "any") return;
            q.progress = Math.min(q.progress + amount, q.required);
            if (q.progress >= q.required) this.#tryComplete(i);
        });
    }

    static notifyHarvest(cropType) { this.#advance("harvest", cropType); }
    static notifyTalk(npcName)     { this.#advance("talk", npcName); }
    static notifyTrash(amount)     { this.#advance("trash", "trash", amount); }
    static notifySell(amount = 1)  { this.#advance("sell", "any", amount); }

    static getSaveData() {
        return { day: this.#currentDay, quests: this.#quests, completed: this.#completed };
    }

    static loadSaveData(data) {
        if (!data) return;
        this.#currentDay = data.day ?? -1;
        this.#quests     = data.quests    || [];
        this.#completed  = data.completed || [];
    }
}
