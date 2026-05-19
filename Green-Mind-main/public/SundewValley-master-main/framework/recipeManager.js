class RecipeManager {
    // ── Recipe Catalogue ─────────────────────────────────────────────────
    static RECIPES = [
        {
            id: "soup",
            name: "Vegetable Soup",
            icon: "🍲",
            bgColor: "#e67e22",
            ingredients: ["tomato", "pumpkin"],
            energy: 30,
            description: "Warm & filling!"
        },
        {
            id: "jam",
            name: "Strawberry Jam",
            icon: "🍓",
            bgColor: "#e74c3c",
            ingredients: ["strawberry", "strawberry"],
            energy: 20,
            description: "Sweet & delicious!"
        },
        {
            id: "stew",
            name: "Hearty Stew",
            icon: "🥘",
            bgColor: "#8e5300",
            ingredients: ["corn", "potato"],
            energy: 40,
            description: "Restores lots of energy!"
        },
        {
            id: "salad",
            name: "Garden Salad",
            icon: "🥗",
            bgColor: "#27ae60",
            ingredients: ["cabbage", "carrot"],
            energy: 25,
            description: "Fresh & healthy!"
        },
        {
            id: "ratatouille",
            name: "Ratatouille",
            icon: "🍆",
            bgColor: "#8e44ad",
            ingredients: ["eggplant", "tomato"],
            energy: 35,
            description: "A gourmet dish!"
        }
    ];

    // ── Food energy lookup (used when eating) ────────────────────────────
    static ENERGY_BY_ID = {
        // Recipes
        ...Object.fromEntries(RecipeManager.RECIPES.map(r => [r.id, r.energy])),
        // Raw Vegetables
        "pumpkin": 10, "cabbage": 8, "carrot": 8, "grain": 5, "potato": 10, 
        "strawberry": 12, "tomato": 8, "eggplant": 10, "corn": 12, "pea": 5,
        // Drinks
        "medicinal_juice": 40, "water": 10, "orange_juice": 25, "apple_juice": 25, "pineapple_juice": 30
    };

    // ── Helpers ───────────────────────────────────────────────────────────
    /** Returns true if player has all required ingredients. */
    static canCraft(recipe, player) {
        const needed = this.#countIngredients(recipe.ingredients);
        for (const [item, qty] of Object.entries(needed)) {
            if (!this.#hasAmount(player, item, qty)) return false;
        }
        return true;
    }

    /** Consume ingredients and give result item. Returns true on success. */
    static craft(recipe, player) {
        if (!this.canCraft(recipe, player)) return false;
        const needed = this.#countIngredients(recipe.ingredients);
        for (const [item, qty] of Object.entries(needed)) {
            player.tryUseItem(item, qty);
        }
        player.obtainItem(recipe.id, 1);
        AchievementManager.notify("chef");
        ASSET_MANAGER.playSound("Gravel_hit3.ogg");
        return true;
    }

    // ── Private helpers ───────────────────────────────────────────────────
    static #countIngredients(list) {
        const map = {};
        list.forEach(i => { map[i] = (map[i] || 0) + 1; });
        return map;
    }

    static #hasAmount(player, key, qty) {
        const inv = (player.getInventory()[key] || {}).amount || 0;
        const bar = (player.getItemBar()[key] || {}).amount || 0;
        return inv + bar >= qty;
    }
}
