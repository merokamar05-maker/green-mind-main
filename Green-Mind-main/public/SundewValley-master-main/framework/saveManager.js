class SaveManager {
    static SAVE_KEY = "sundew_valley_save";

    static save() {
        if (!Level.PLAYER) return;

        const currentLevelName = GAME_ENGINE.getCurrentLevelName();
        const data = {
            player: {
                money: Level.PLAYER.getMoney(),
                karma: Level.PLAYER.getKarma(),
                inventory: Level.PLAYER.getInventory(),
                itemBar: Level.PLAYER.getItemBar(),
                pos: { x: Level.PLAYER.getBlockX(), y: Level.PLAYER.getBlockY() },
                level: currentLevelName
            },
            time: {
                timestamp: DateTimeSystem.getDateObject().getTime(),
                realTime: Date.now()
            },
            world: {
                chests: Chest.CHESTS,
                farmModifications: this.#getFarmModifications(),
                townEvent: SaveManager.townEvent || { lastSpawnDay: 0, caughtCount: 0 },
                seenVideos: SaveManager.seenVideos || [],
                quests: (typeof QuestManager !== "undefined") ? QuestManager.getSaveData() : null,
                friendship: (typeof FriendshipManager !== "undefined") ? FriendshipManager.getSaveData() : null,
                energy: (typeof EnergyManager !== "undefined") ? EnergyManager.getSaveData() : null,
                achievements: (typeof AchievementManager !== "undefined") ? AchievementManager.getSaveData() : null
            }
        };

        localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
        console.log("Game Saved!");
    }

    static load() {
        const savedData = localStorage.getItem(this.SAVE_KEY);
        if (!savedData) return null;

        try {
            const data = JSON.parse(savedData);
            // Restore world state safely
            if (data.world) {
                // Restore Chests
                if (data.world.chests) {
                    Chest.CHESTS = data.world.chests;
                }
                if (!Chest.CHESTS.TradingBox) Chest.CHESTS.TradingBox = {};

                // Restore town event state globally so Level can access it
                if (data.world.townEvent) {
                    SaveManager.townEvent = data.world.townEvent;
                }

                // Restore seen videos
                if (data.world.seenVideos) {
                    SaveManager.seenVideos = data.world.seenVideos;
                } else {
                    SaveManager.seenVideos = [];
                }

                // Restore quest progress
                if (data.world.quests && typeof QuestManager !== "undefined") {
                    QuestManager.loadSaveData(data.world.quests);
                }

                // Restore friendship points
                if (data.world.friendship && typeof FriendshipManager !== "undefined") {
                    FriendshipManager.loadSaveData(data.world.friendship);
                }

                // Restore energy
                if (data.world.energy && typeof EnergyManager !== "undefined") {
                    EnergyManager.loadSaveData(data.world.energy);
                }

                // Restore achievements
                if (data.world.achievements && typeof AchievementManager !== "undefined") {
                    AchievementManager.loadSaveData(data.world.achievements);
                }
            } else {
                // Default if world is completely missing
                SaveManager.seenVideos = [];
                if (!Chest.CHESTS.TradingBox) Chest.CHESTS.TradingBox = {};
            }

            return data;
        } catch (e) {
            console.error("Failed to load save:", e);
            return null;
        }
    }

    static reset() {
        localStorage.removeItem(this.SAVE_KEY);
        window.location.reload();
    }

    static #getFarmModifications() {
        // Find the farm level if it exists in the engine's cache
        // We need to iterate through all pre-loaded levels to save all farm states
        // But for now let's focus on the active level if it's a farm
        const farm = GAME_ENGINE.getCurrentLevel();
        if (!(farm instanceof FarmLevel)) return null;

        const modifications = {
            tiles: [],
            crops: [],
            animals: []
        };

        // Save crops
        farm.getEntities().forEach(e => {
            if (e instanceof Crop) {
                modifications.crops.push({
                    type: e.getType(),
                    x: e.getBlockX(),
                    y: e.getBlockY(),
                    stage: e.getStage(),
                    timePlanted: e.getTimePlanted().getTime()
                });
            } else if (e instanceof Animal && !(e instanceof Player)) {
                modifications.animals.push({
                    type: e.getType(),
                    subType: e.getSubType(),
                    x: e.getBlockX(),
                    y: e.getBlockY()
                });
            }
        });

        // Save dirt/watered dirt tiles
        for (let y = 0; y < farm.getRow(); y++) {
            for (let x = 0; x < farm.getColumn(); x++) {
                const layers = farm.getTile(x, y);
                for (let i = 0; i < layers.length; i++) {
                    const id = layers[i];
                    if (id === 0) continue;
                    // Note: We check if it's dirt OR watered dirt
                    if (DirtTiles.isDirt(id) || WateredDirtTiles.isWateredDirt(id)) {
                        modifications.tiles.push({x, y, layerIndex: i, id: id});
                    }
                }
            }
        }
        return modifications;
    }

    static applyModifications(level, modifications) {
        if (!modifications) return;
        
        if (level instanceof FarmLevel) {
            // Apply tiles
            modifications.tiles.forEach(t => {
                const targetTile = level.getTile(t.x, t.y);
                if (targetTile) targetTile[t.layerIndex] = t.id;
            });
            // Apply crops
            modifications.crops.forEach(c => {
                const crop = new Crop(c.type, c.x, c.y, level);
                crop.setStage(c.stage);
                crop.setTimePlanted(new Date(c.timePlanted));
                level.addEntity(crop);
            });
            // Apply animals
            modifications.animals.forEach(a => {
                // Map the animal type to the correct class
                const animalClasses = {
                    "chicken": Chicken,
                    "cow": Cow,
                    "goat": Goat,
                    "pig": Pig,
                    "sheep": Sheep
                };
                const AnimalClass = animalClasses[a.type];
                if (AnimalClass) {
                    const animal = new AnimalClass(a.subType, a.x, a.y, level);
                    level.addEntity(animal);
                }
            });
        }
    }

    static markVideoAsSeen(videoName) {
        if (!SaveManager.seenVideos) SaveManager.seenVideos = [];
        if (!SaveManager.seenVideos.includes(videoName)) {
            SaveManager.seenVideos.push(videoName);
            
            // Partial Update: Only update seenVideos in localStorage to avoid saving 
            // inconsistent player coordinates during level transitions.
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (!data.world) data.world = {};
                    data.world.seenVideos = SaveManager.seenVideos;
                    localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
                } catch (e) {
                    console.error("Failed to update seenVideos in localStorage:", e);
                }
            }
        }
    }

    static hasSeenVideo(videoName) {
        if (!SaveManager.seenVideos) return false;
        return SaveManager.seenVideos.includes(videoName);
    }
}
