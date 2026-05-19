class FriendshipManager {
    static #points      = {}; // npcName -> 0-100
    static #talkedToday = {}; // npcName -> bool
    static #lastDay     = -1;

    static update() {
        const today = DateTimeSystem.getTotalDays();
        if (today !== this.#lastDay) {
            this.#lastDay     = today;
            this.#talkedToday = {};
        }
    }

    // +5 pts once per day per NPC (daily talk bonus)
    static addTalkPoints(npcName) {
        if (this.#talkedToday[npcName]) return;
        this.#talkedToday[npcName] = true;
        this.addPoints(npcName, 5);
    }

    // General-purpose points (for special actions: gifts, helping, etc.)
    static addPoints(npcName, amount) {
        if (!this.#points[npcName]) this.#points[npcName] = 0;
        this.#points[npcName] = Math.min(100, this.#points[npcName] + amount);
        console.log(`[Friendship] ${npcName}: ${this.#points[npcName]} pts → ${this.getHearts(npcName)}♥`);
        
        // Notify achievements
        if (typeof AchievementManager !== "undefined") {
            AchievementManager.notifyFriendship(this.getHearts(npcName));
        }
    }

    static getPoints(npcName) { return this.#points[npcName] || 0; }

    // Returns 0-10
    static getHearts(npcName) { return Math.floor(this.getPoints(npcName) / 10); }

    static getSaveData() {
        return { points: { ...this.#points }, lastDay: this.#lastDay };
    }

    static loadSaveData(data) {
        if (!data) return;
        this.#points  = data.points  || {};
        this.#lastDay = data.lastDay ?? -1;
    }
}
