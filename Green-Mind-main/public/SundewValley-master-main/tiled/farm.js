class FarmLevel extends Level {
    constructor(_path) {
        super(_path)
    }

    onEnter() {
        // --- Animal Spawning from Inventory & ItemBar ---
        const inventory = Level.PLAYER.getInventory();
        const itemBar = Level.PLAYER.getItemBar();
        
        // Map item keys to their respective classes and all available adult variants
        const animalMapping = {
            "chicken": { 
                class: Chicken, 
                variants: ["black_chicken", "brown_and_white_chicken", "brown_chicken", "white_chicken"] 
            },
            "cow": { 
                class: Cow, 
                variants: ["black_cow", "brown_cow", "strawberry_cow"] 
            },
            "goat": { 
                class: Goat, 
                variants: ["blackberry_goat", "black_goat", "brown_goat", "white_goat"] 
            },
            "pig": { 
                class: Pig, 
                variants: ["pink_pig", "spotted_pig"] 
            },
            "sheep": { 
                class: Sheep, 
                variants: ["fluffy_white_sheep_sheet", "white_sheep_sheet"] 
            }
        };

        const processContainer = (container) => {
            if (!container) return;
            Object.keys(animalMapping).forEach(key => {
                if (container[key] && container[key].amount > 0) {
                    const count = container[key].amount;
                    const config = animalMapping[key];
                    if (config && typeof config.class === 'function') {
                        for (let i = 0; i < count; i++) {
                            let spawnX, spawnY;
                            if (key === "chicken") {
                                // Moved 2 steps up from [7, 45]
                                spawnX = 7 + Math.random() * 2;
                                spawnY = 43 + Math.random() * 2;
                            } else {
                                // Moved 2 steps up and 5 steps right from [5, 18]
                                spawnX = 10 + Math.random() * 4;
                                spawnY = 16 + Math.random() * 4;
                            }
                            try {
                                // Pick a random variant from the list
                                const variant = config.variants[Math.floor(Math.random() * config.variants.length)];
                                this.addEntity(new config.class(variant, spawnX, spawnY, this));
                            } catch (e) {
                                console.error(`Failed to spawn animal ${key}:`, e);
                            }
                        }
                        // Remove the animal items as they are now on the farm
                        delete container[key];
                    } else {
                        console.warn(`Missing class for animal type: ${key}`);
                    }
                }
            });
        };

        processContainer(inventory);
        processContainer(itemBar);
    }

    static dailyClosing() {
        const keys = Object.keys(Chest.CHESTS.TradingBox)
        keys.forEach(_key => {
            if (!_key.endsWith("_seed") && InventoryItems.PRICES[_key] != null) {
                Level.PLAYER.earnMoney(InventoryItems.PRICES[_key] * Chest.CHESTS.TradingBox[_key]["amount"])
                delete Chest.CHESTS.TradingBox[_key]
            }
        })
        const amelyPtr = this.findEntityGlobally(_e => _e instanceof Npc && _e.getName().localeCompare("Amely") === 0)
        if (amelyPtr != null) amelyPtr.dailyClosing()
        // Reset the daily knock reward
        Dialogues.HAS_KNOCKED_TODAY = false
    }

    getCropOnCoordinate(x, y) {
        return this.findEntity(_entity => Math.floor(_entity.getBlockX()) === x && Math.floor(_entity.getBlockY()) === y && _entity instanceof Crop)
    }

    getCrop(x, y) {
        return this.getEntityUsingFilter(e => Math.floor(e.getBlockX()) === Math.floor(x) && Math.floor(e.getBlockY()) === Math.floor(y) && e instanceof Crop)
    }

    // if player can plant on tile
    canPlantOnTile(x, y) {
        const layers = this.getTile(x, y)
        WateredDirtTiles.offset = this.getAbsMetaId("tilemaps", DateTimeSystem.getSeason(), 0)
        for (let i = 0; i < layers.length; i++) {
            if (WateredDirtTiles.isWateredDirt(layers[i])) {
                return this.getCrop(x, y) == null
            }
        }
        return false;
    }

    #updateDirtKind(x, y, index, checkTileNextToIt = true) {
        const dirtKind = new DirtTiles()
        let indexTmp = this.getTileLayerIndexUsingFilter(x - 1, y, DirtTiles.isDirt)
        if (indexTmp >= 0) {
            dirtKind.leftConnected = true
            if (checkTileNextToIt) this.#updateDirtKind(x - 1, y, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x, y - 1, DirtTiles.isDirt)
        if (indexTmp >= 0) {
            dirtKind.upConnected = true
            if (checkTileNextToIt) this.#updateDirtKind(x, y - 1, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x + 1, y, DirtTiles.isDirt)
        if (indexTmp >= 0) {
            dirtKind.rightConnected = true
            if (checkTileNextToIt) this.#updateDirtKind(x + 1, y, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x, y + 1, DirtTiles.isDirt)
        if (indexTmp >= 0) {
            dirtKind.downConnected = true
            if (checkTileNextToIt) this.#updateDirtKind(x, y + 1, indexTmp, false)
        }
        this.getTile(x, y)[index] = dirtKind.getId() + DirtTiles.offset
    }

    tryConvertTileToDirt(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        const layerIndex = this.getTileLayerIndex(x, y, "tilemaps", DateTimeSystem.getSeason(), 12)
        if (layerIndex >= 0) {
            // update dirt tile offset
            DirtTiles.offset = this.getAbsMetaId("tilemaps", DateTimeSystem.getSeason(), 0)
            // temporary assign a valid dirt tile to the tile
            this.getTile(x, y)[layerIndex + 1] = DirtTiles.offset + 90
            this.getTile(x, y)[layerIndex + 2] = 0
            // update the dirt tile type for the tile
            this.#updateDirtKind(x, y, layerIndex + 1)
            const cropOnLocation = this.getCropOnCoordinate(x, y)
            if (cropOnLocation !== undefined) {
                cropOnLocation.removeFromWorld = true
            }
        }
    }

    #updateWateredDirtKind(x, y, index, checkTileNextToIt = true) {
        const wateredDirtKind = new WateredDirtTiles()
        let indexTmp = this.getTileLayerIndexUsingFilter(x - 1, y, WateredDirtTiles.isWateredDirt)
        if (indexTmp >= 0) {
            wateredDirtKind.leftConnected = true
            if (checkTileNextToIt) this.#updateWateredDirtKind(x - 1, y, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x, y - 1, WateredDirtTiles.isWateredDirt)
        if (indexTmp >= 0) {
            wateredDirtKind.upConnected = true
            if (checkTileNextToIt) this.#updateWateredDirtKind(x, y - 1, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x + 1, y, WateredDirtTiles.isWateredDirt)
        if (indexTmp >= 0) {
            wateredDirtKind.rightConnected = true
            if (checkTileNextToIt) this.#updateWateredDirtKind(x + 1, y, indexTmp, false)
        }
        indexTmp = this.getTileLayerIndexUsingFilter(x, y + 1, WateredDirtTiles.isWateredDirt)
        if (indexTmp >= 0) {
            wateredDirtKind.downConnected = true
            if (checkTileNextToIt) this.#updateWateredDirtKind(x, y + 1, indexTmp, false)
        }
        this.getTile(x, y)[index] = wateredDirtKind.getId() + WateredDirtTiles.offset
    }

    tryConvertTileToWateredDirt(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        // update dirt tile offset
        DirtTiles.offset = this.getAbsMetaId("tilemaps", DateTimeSystem.getSeason(), 0)
        const layerIndex = this.getTileLayerIndexUsingFilter(x, y, DirtTiles.isDirt)
        if (layerIndex >= 0) {
            // update watered dirt tile offset
            WateredDirtTiles.offset = this.getAbsMetaId("tilemaps", DateTimeSystem.getSeason(), 0)
            // temporary assign a valid watered dirt tile to the tile
            this.getTile(x, y)[layerIndex + 1] = WateredDirtTiles.offset + 121
            // update the watered dirt tile type for the tile
            this.#updateWateredDirtKind(x, y, layerIndex + 1)
        }
    }
}