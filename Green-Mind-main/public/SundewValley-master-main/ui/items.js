class InventoryItems {

    static #ITEMS_SPRITE_SHEET
    static #PIXEL_SIZE
    static #LOCATIONS = {
        "pumpkin": [0, 0],
        "cabbage": [1, 0],
        "carrot": [2, 0],
        "grain": [3, 0],
        "potato": [4, 0],
        "strawberry": [5, 0],
        "tomato": [6, 0],
        "eggplant": [7, 0],
        "lavender": [8, 0],
        "corn": [9, 0],
        "pea": [9, 2],
        "pumpkin_seed": [0, 1],
        "cabbage_seed": [1, 1],
        "carrot_seed": [2, 1],
        "grain_seed": [3, 1],
        "potato_seed": [4, 1],
        "strawberry_seed": [5, 1],
        "tomato_seed": [6, 1],
        "eggplant_seed": [7, 1],
        "lavender_seed": [8, 1],
        "corn_seed": [9, 1],
        "pea_seed": [9, 3],
        "pot": [0, 3],
        "axe": [0, 4],
        "hoe": [3, 4],
        "chicken": [1, 2],
        "cow": [2, 2],
        "goat": [4, 2],
        "pig": [5, 2],
        "sheep": [6, 2],
        "medicinal_juice": [1, 3],
        "water": [2, 3],
        "orange_juice": [3, 3],
        "apple_juice": [4, 3],
        "pineapple_juice": [5, 3],
        "trash": [9, 2]
    }
    static PRICES = {
        "pumpkin": 200,
        "cabbage": 200,
        "carrot": 200,
        "grain": 200,
        "potato": 200,
        "strawberry": 200,
        "tomato": 200,
        "eggplant": 200,
        "lavender": 200,
        "corn": 200,
        "pea": 200,
        "pumpkin_seed": 20,
        "cabbage_seed": 20,
        "carrot_seed": 20,
        "grain_seed": 20,
        "potato_seed": 20,
        "strawberry_seed": 20,
        "tomato_seed": 20,
        "eggplant_seed": 20,
        "lavender_seed": 20,
        "corn_seed": 20,
        "pea_seed": 20,
        "chicken": 500,
        "cow": 1500,
        "goat": 1000,
        "pig": 2000,
        "sheep": 1200,
        "medicinal_juice": 500,
        "water": 5,
        "orange_juice": 15,
        "apple_juice": 15,
        "pineapple_juice": 15,
        "trash": 5,
        // ── Cooked food (from kitchen) ──────────────────────────────────
        "soup":        150,
        "jam":         120,
        "stew":        200,
        "salad":       130,
        "ratatouille": 175
    }
    static NAMES = {
        "pumpkin": "Pumpkin",
        "cabbage": "Cabbage",
        "carrot": "Carrot",
        "grain": "Grain",
        "potato": "Potato",
        "strawberry": "Strawberry",
        "tomato": "Tomato",
        "eggplant": "Eggplant",
        "lavender": "Lavender",
        "corn": "Corn",
        "pea": "Pea",
        "pumpkin_seed": "Pumpkin seed",
        "cabbage_seed": "Cabbage seed",
        "carrot_seed": "Carrot seed",
        "grain_seed": "Grain Seed",
        "potato_seed": "Potato seed",
        "strawberry_seed": "Strawberry seed",
        "tomato_seed": "Tomato seed",
        "eggplant_seed": "Eggplant seed",
        "lavender_seed": "Lavender seed",
        "corn_seed": "Corn seed",
        "pea_seed": "Pea seed",
        "chicken": "Chicken",
        "cow": "Cow",
        "goat": "Goat",
        "pig": "Pig",
        "sheep": "Sheep",
        "medicinal_juice": "Medicinal Juice",
        "water": "Water",
        "orange_juice": "Orange Juice",
        "apple_juice": "Apple Juice",
        "pineapple_juice": "Pineapple Juice",
        "trash": "Trash Bag",
        // ── Cooked food ─────────────────────────────────────────────────
        "soup":        "Vegetable Soup",
        "jam":         "Strawberry Jam",
        "stew":        "Hearty Stew",
        "salad":       "Garden Salad",
        "ratatouille": "Ratatouille"
    }

    // Animals: map to their image path that is already loaded via additional.json
    static ANIMAL_IMAGES = {
        "chicken": "./images/animals/chicken/white_chicken.png",
        "cow": "./images/animals/cow/black_cow.png",
        "goat": "./images/animals/goat/black_goat.png",
        "pig": "./images/animals/pig/pink_pig.png",
        "sheep": "./images/animals/sheep/white_sheep_sheet.png"
    }

    static STANDALONE_IMAGES = {
        "medicinal_juice": "./images/items/grand juice.png",
        "trash": "./images/items/trash.png"
    }

    static init() {
        this.#ITEMS_SPRITE_SHEET = ASSET_MANAGER.getImage("items", "items.png")
        this.#PIXEL_SIZE = ASSET_MANAGER.getJson("images", "items", "items.json")["tilewidth"]
    }

    // if an item can be used / eaten
    static isUsable(key) {
        return key.endsWith("seed");
    }

    // Categorization
    static VEGGIES = new Set(["pumpkin", "cabbage", "carrot", "grain", "potato", "strawberry", "tomato", "eggplant", "lavender", "corn", "pea"]);
    static DRINKS  = new Set(["medicinal_juice", "water", "orange_juice", "apple_juice", "pineapple_juice"]);
    static FOOD_ITEMS = new Set(["soup", "jam", "stew", "salad", "ratatouille"]);

    static isVegetable(key) { return this.VEGGIES.has(key); }
    static isDrink(key)     { return this.DRINKS.has(key); }
    static isFood(key)      { return this.FOOD_ITEMS.has(key); }

    static drawImage(ctx, key, pixelX, pixelY, width, height, offsetTileX = 0, offsetTileY = 0) {
        // If it's an animal, draw its sprite directly from the cached image
        if (this.ANIMAL_IMAGES[key] != null) {
            const imgPath = this.ANIMAL_IMAGES[key];
            const img = ASSET_MANAGER.getImageByPath(imgPath);
            if (img && img.complete && img.naturalWidth > 0) {
                // Determine frame size: 16x16 for chicken, 26x26 for others (cow, goat, pig, sheep)
                const frameSize = (key === "chicken") ? 16 : 26;
                
                // Draw just the first frame (idle) for high clarity
                // Center it in the slot with a small margin
                const margin = width * 0.1;
                const dw = width - margin * 2;
                const dh = height - margin * 2;
                const dx = pixelX + margin;
                const dy = pixelY + margin;
                
                ctx.drawImage(img, 
                    0, 0, frameSize, frameSize, // Source frame (top-left)
                    dx, dy, dw, dh              // Destination slot
                );
                return;
            }
        }

        // If it's a standalone image for an item
        if (this.STANDALONE_IMAGES[key] != null) {
            const imgPath = this.STANDALONE_IMAGES[key];
            const img = ASSET_MANAGER.getImageByPath(imgPath);
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, pixelX, pixelY, width, height);
                return;
            }
        }
        
        // ── Canvas-drawn food items (no sprite sheet) ──────────────────
        if (this.FOOD_ITEMS && this.FOOD_ITEMS.has(key)) {
            this.#drawFoodCanvas(ctx, key, pixelX, pixelY, width, height);
            return;
        }

        // Default items drawing from sprite sheet
        const _loc = this.#LOCATIONS[key]
        if (_loc) {
            ctx.drawImage(this.#ITEMS_SPRITE_SHEET, (_loc[0] + offsetTileX) * this.#PIXEL_SIZE, (_loc[1] + offsetTileY) * this.#PIXEL_SIZE, this.#PIXEL_SIZE, this.#PIXEL_SIZE, pixelX, pixelY, width, height)
        }
    }

    // ── Cartoon food drawing (shared with RecipeUI) ────────────────────────
    static #drawFoodCanvas(ctx, key, px, py, w, h) {
        const cx = px + w / 2, cy = py + h / 2, r = Math.min(w, h) * 0.4;
        ctx.save();
        const colors = { soup:"#e67e22", jam:"#e74c3c", stew:"#8e5300", salad:"#27ae60", ratatouille:"#8e44ad" };
        const icons  = { soup:"🍲", jam:"🍓", stew:"🥘", salad:"🥗", ratatouille:"🍆" };
        // Filled circle base
        ctx.fillStyle = colors[key] || "#888";
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        // Emoji on top
        ctx.font = `${Math.floor(r * 1.1)}px Segoe UI Emoji`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icons[key] || "🍽", cx, cy + 1);
        ctx.restore();
    }
}
