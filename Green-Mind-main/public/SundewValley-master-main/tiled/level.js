class Level extends AbstractTiledMap {
    static PLAYER
    static #ALL_ENTITIES = []
    static BGM = "$NO_MUSIC$"
    static STORY_PLAYING = false
    #entities = []
    #automapTilesFirstGid = -1

    getEntities() {
        return this.#entities
    }

    constructor(_path) {
        super(_path)
        // if automap-tiles are used for rules, then cache its first gid id
        for (let i = 0, n = this.getTileSets().length; i < n; i++) {
            if (this.getTileSet(i)["source"].endsWith("automap-tiles.tsx")) {
                this.#automapTilesFirstGid = this.getTileSet(i)["firstgid"]
                break;
            }
        }
        if (this.getParameter("triggers") == null) {
            this.setParameter("triggers", [])
        }
        this.updateLevelMusic()
        this.trashRegenTimer = 0;
        this.lastAnimalSpawnDay = -1;
        this.townAnimalsCaughtCount = 0;
    }

    static #setPlayerCoordinate(x, y) {
        this.PLAYER.setBlockX(x)
        this.PLAYER.setBlockY(y)
        const theCurrentLevel = this.PLAYER.getMapReference()
        theCurrentLevel.setPixelX(-this.PLAYER.getBlockX() * theCurrentLevel.getTileSize() + GAME_ENGINE.ctx.canvas.width / 2)
        theCurrentLevel.setPixelY(-this.PLAYER.getBlockY() * theCurrentLevel.getTileSize() + GAME_ENGINE.ctx.canvas.height / 2)
    }

    static findEntityGlobally(_filter) {
        return Level.#ALL_ENTITIES.find(_filter)
    }

    static teleportPlayer(x, y) {
        if (this.PLAYER) this.#setPlayerCoordinate(x, y)
    }

    #getBgm() {
        const theBgm = (6 < DateTimeSystem.getHour() && DateTimeSystem.getHour() < 18) ? this.getParameter("morning_music") : this.getParameter("night_music")
        return theBgm != null ? theBgm : "$NO_MUSIC$"
    }

    #updateLevelMusicTo(theBgm) {
        if (theBgm.localeCompare(Level.BGM) !== 0) {
            if (Level.BGM.localeCompare("$NO_MUSIC$") !== 0) ASSET_MANAGER.stopMusic(Level.BGM)
            Level.BGM = theBgm
        }
    }

    updateLevelMusic() {
        this.#updateLevelMusicTo(this.#getBgm())
    }

    getTileSize() {
        return this.getTileWidth()
    }

    findEntity(_filter) {
        return this.#entities.find(_filter)
    }

    canEnterTile(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        if (!this.isCoordinateInRange(x, y)) {
            return false
        } else if (this.#automapTilesFirstGid > 0) {
            return this.getTileLayerIndexUsingFilter(x, y, metaId => metaId === this.#automapTilesFirstGid) < 0
        }
        return true
    }

    addEntity(entity) {
        if (!this.#entities.includes(entity)) {
            this.#entities.push(entity);
        }
        if (!Level.#ALL_ENTITIES.includes(entity)) {
            Level.#ALL_ENTITIES.push(entity)
        }
    };

    goToSpawn() {
        let _spawn = this.getParameter("spawn")
        if (_spawn == null) _spawn = [0, 0]
        Level.#setPlayerCoordinate(_spawn[0], _spawn[1])
    }

    initEntities() {
        this.#entities = []
        if (Level.PLAYER == null) {
            let playerName = "Cody"
            /*while (playerName == null){
                playerName = prompt("Please enter player name", "Cody");
            }*/
            Level.PLAYER = new Player(playerName, 0, 0, this)
            this.goToSpawn()
            Level.PLAYER.obtainItem("potato_seed")
            Level.PLAYER.obtainItem("potato", 2)
            Level.PLAYER.obtainItem("corn", 2)
            Level.PLAYER.obtainItem("pea", 2)
            Level.PLAYER.obtainItem("pumpkin_seed", 2)
            Level.PLAYER.obtainItem("cabbage_seed", 2)
            Level.PLAYER.obtainItem("grain_seed", 2)
            Level.PLAYER.obtainItem("grain_seed", 2)
            Level.PLAYER.obtainItem("cabbage", 2)
            Level.PLAYER.obtainItem("grain_seed", 5)
            Level.PLAYER.obtainItem("pea", 2)
            Level.PLAYER.obtainItem("lavender_seed", 2)
            Level.PLAYER.obtainItem("tomato", 9)
            Level.PLAYER.obtainItem("strawberry", 10)
        }
        Level.PLAYER.setMapReference(this)
        this.addEntity(Level.PLAYER);
        Level.PLAYER.ishidden = this.getParameter("hide_player") === true;
        if (this.getParameter("entities") != null) {
            this.getParameter("entities").forEach(_e => {
                if (_e.type.localeCompare("chest") === 0) {
                    this.addEntity(new Chest(_e.name, _e.x, _e.y, this));
                } else if (_e.type.localeCompare("npc") === 0) {
                    const _entity = new Npc(_e.name, _e.x, _e.y, this)
                    if (_e["money"] != null) {
                        _entity.setMoney(_e["money"])
                    }
                    this.addEntity(_entity);
                } else if (_e.type.localeCompare("chicken") === 0) {
                    this.addEntity(new Chicken(_e.name, _e.x, _e.y, this));
                } else if (_e.type.localeCompare("cow") === 0) {
                    this.addEntity(new Cow(_e.name, _e.x, _e.y, this));
                } else if (_e.type.localeCompare("goat") === 0) {
                    this.addEntity(new Goat(_e.name, _e.x, _e.y, this));
                } else if (_e.type.localeCompare("pig") === 0) {
                    this.addEntity(new Pig(_e.name, _e.x, _e.y, this));
                } else if (_e.type.localeCompare("sheep") === 0) {
                    this.addEntity(new Sheep(_e.name, _e.x, _e.y, this));
                }
            })
        }
        /*
        if (this instanceof FarmLevel) {
            this.addEntity(new Chicken("black_chicken", 10, 10, this));
            this.addEntity(new Cow("strawberry_cow", 12, 11, this));
            this.addEntity(new Goat("brown_goat", 15, 12, this));
            this.addEntity(new Pig("pink_pig", 13, 15, this));
            this.addEntity(new Sheep("fluffy_white_sheep_sheet", 9, 13, this));
            this.addEntity(new Crop("potato", 15, 12, this));
        } */

        if (this instanceof FarmLevel) {
            const farmTrashSpots = [
                [18, 15], [22, 18], [25, 14], [28, 20], [15, 25]
            ];
            farmTrashSpots.forEach((pos, i) => {
                this.addEntity(new Trash("farm_trash_" + i, pos[0], pos[1], this));
            });
        }

        // Spawn trash in Town
        const isTown = this.getParameter("morning_music") === "OST 1 - Good Morning.ogg";
        const townTrashSpots = [
            [35, 65], [40, 60], [38, 55], [42, 68], [32, 58]
        ];
        if (isTown && !(this instanceof FarmLevel || this instanceof Bedroom)) {
            townTrashSpots.forEach((pos, i) => {
                // Add initial randomness (+/- 2 tiles)
                const randomX = pos[0] + getRandomIntInclusive(-2, 2);
                const randomY = pos[1] + getRandomIntInclusive(-2, 2);
                
                // Ensure it's walkable
                const spawnX = this.canEnterTile(randomX, randomY) ? randomX : pos[0];
                const spawnY = this.canEnterTile(randomX, randomY) ? randomY : pos[1];

                this.addEntity(new Trash("town_trash_" + i, spawnX, spawnY, this));
            });

            // Restore town event state from SaveManager if available
            if (SaveManager.townEvent) {
                this.lastAnimalSpawnDay = SaveManager.townEvent.lastSpawnDay !== undefined ? SaveManager.townEvent.lastSpawnDay : -1;
                this.townAnimalsCaughtCount = SaveManager.townEvent.caughtCount || 0;
            }

            // Periodic Animal Spawning Logic
            const currentDay = DateTimeSystem.getTotalDays();
            // Trigger if never spawned (-1) OR if 7 days have passed
            if (this.lastAnimalSpawnDay === -1 || currentDay >= this.lastAnimalSpawnDay + 7) {
                // Only spawn if we haven't already spawned for this cycle
                const existingEscaped = this.getEntities().filter(e => e instanceof Animal && e.isEscaped()).length;
                
                if (existingEscaped === 0) {
                    const isFirstSpawn = this.lastAnimalSpawnDay === -1;
                    this.lastAnimalSpawnDay = currentDay;
                    this.townAnimalsCaughtCount = 0;

                    // First time = 5 animals. Subsequent times = 2-4 animals (decreased).
                    const quantity = isFirstSpawn ? 5 : getRandomIntInclusive(2, 4);
                    const youssefPos = [75, 38.5];
                    const shopsPos = [33, 39];

                    const animalVarieties = [
                        { class: Chicken, variants: ["black_chicken", "brown_and_white_chicken", "brown_chicken", "white_chicken"] },
                        { class: Cow, variants: ["black_cow", "brown_cow", "strawberry_cow"] },
                        { class: Goat, variants: ["blackberry_goat", "black_goat", "brown_goat", "white_goat"] },
                        { class: Pig, variants: ["pink_pig", "spotted_pig"] },
                        { class: Sheep, variants: ["fluffy_white_sheep_sheet", "white_sheep_sheet"] }
                    ];

                    for (let i = 0; i < quantity; i++) {
                        // Alternate between Youssef and Shops locations
                        const basePos = (i % 2 === 0) ? youssefPos : shopsPos;
                        
                        // Pick a random animal type and a random variant
                        const variety = animalVarieties[getRandomIntInclusive(0, animalVarieties.length - 1)];
                        const AnimalClass = variety.class;
                        const subType = variety.variants[getRandomIntInclusive(0, variety.variants.length - 1)];
                        
                        // Retry logic to ensure the animal actually spawns
                        let spawned = false;
                        for (let attempt = 0; attempt < 20 && !spawned; attempt++) {
                            const rx = basePos[0] + getRandomIntInclusive(-6, 6);
                            const ry = basePos[1] + getRandomIntInclusive(-6, 6);
                            
                            if (this.canEnterTile(rx, ry)) {
                                const animal = new AnimalClass(subType, rx, ry, this);
                                animal.setIsEscaped(true);
                                this.addEntity(animal);
                                spawned = true;
                            }
                        }
                    }
                    console.log(`Spawned ${quantity} escaped animals in Town for day ${currentDay} (First spawn: ${isFirstSpawn})`);
                    
                    // Update global state
                    SaveManager.townEvent = {
                        lastSpawnDay: this.lastAnimalSpawnDay,
                        caughtCount: this.townAnimalsCaughtCount
                    };
                }
            }
        }

        // Spawn trash in the bedroom
        if (this instanceof Bedroom) {
            const bedroomTrashSpots = [
                [11, 22], [18, 24], [30, 25], [38, 24], [45, 25]
            ];
            bedroomTrashSpots.forEach((pos, i) => {
                this.addEntity(new Trash("bedroom_trash_" + i, pos[0], pos[1], this));
            });
        }
    };

    spawnRandomTrash() {
        const townTrashSpots = [
            [35, 65], [40, 60], [38, 55], [42, 68], [32, 58]
        ];
        const randomBase = townTrashSpots[getRandomIntInclusive(0, townTrashSpots.length - 1)];
        const randomX = randomBase[0] + getRandomIntInclusive(-3, 3);
        const randomY = randomBase[1] + getRandomIntInclusive(-3, 3);

        if (this.canEnterTile(randomX, randomY)) {
            const existing = this.getEntityUsingFilter(e => e instanceof Trash && e.getBlockX() === randomX && e.getBlockY() === randomY);
            if (!existing) {
                this.addEntity(new Trash("dynamic_trash_" + Date.now(), randomX, randomY, this));
                return true;
            }
        }
        return false;
    }

    onEnter() {
        // Default onEnter does nothing
    }

    onAnimalCaught(animal) {
        this.townAnimalsCaughtCount++;
        // Update global state immediately
        SaveManager.townEvent = {
            lastSpawnDay: this.lastAnimalSpawnDay,
            caughtCount: this.townAnimalsCaughtCount
        };
    }

    getEntityUsingFilter(_filter) {
        for (let i = this.#entities.length - 1; i >= 0; i--) {
            if (_filter(this.#entities[i])) {
                return this.#entities[i]
            }
        }
        return null
    }

    getEntitiesThatCollideWith(entity) {
        return this.#entities.filter(_entity => entity !== _entity && entity.collideWith(_entity))
    }

    logDebugInfo() {
        super.logDebugInfo()
        this.#entities.sort((entity1, entity2) => entity1.getType().localeCompare(entity2.getType()) || entity1.getUid() - entity2.getUid())
        this.#entities.forEach(entity => {
            Debugger.pushInfo("--------------------")
            if (entity instanceof Character) {
                Debugger.pushInfo(`name: ${entity.getName()}`)
                Debugger.pushInfo("inventory:")
                if (entity instanceof Player) {
                    Object.keys(entity.getItemBar()).forEach(key => {
                        Debugger.pushInfo(`- ${key}: ${JSON.stringify(entity.getItemBar()[key])}`)
                    })
                }
                Object.keys(entity.getInventory()).forEach(key => {
                    Debugger.pushInfo(`-- ${key}: ${JSON.stringify(entity.getInventory()[key])}`)
                })
                Debugger.pushInfo(`money: ${entity.getMoney()}`)
            }
            Debugger.pushInfo(`type: ${entity.getType()}; size: [${entity.getWidth()}, ${entity.getHeight()}]`)
            Debugger.pushInfo(`pixel pos: [${entity.getPixelX()}, ${entity.getPixelY()}]; block pos: [${Math.round(entity.getBlockX() * 100) / 100}, ${Math.round(entity.getBlockY() * 100) / 100}]`)
            if (entity instanceof Creature) {
                Debugger.pushInfo(`current speed: [${entity.getCurrentMovingSpeedX()} ${entity.getCurrentMovingSpeedY()}]; current action: ${entity.getCurrentAction()}`)
            } else if (entity instanceof Crop) {
                Debugger.pushInfo(`current stage: ${entity.getStage()}; time until stage: ${entity.getTimeUntilNextStageInMs()}`)
            }
        });
        Debugger.pushInfo("--------------------")
        Debugger.pushInfo("Triggers:")
        this.getParameter("triggers").forEach(key => {
            Debugger.pushInfo(`- ${JSON.stringify(key)}`)
        })
        Debugger.pushInfo("--------------------")
        Debugger.pushInfo("Item in trade chest:")
        Object.keys(Chest.CHESTS.TradingBox).forEach(key => {
            Debugger.pushInfo(`- ${key}: ${JSON.stringify(Chest.CHESTS.TradingBox[key])}`)
        })
        Debugger.pushInfo("--------------------")
        const entitiesThatCollideWithPlayer = this.getEntitiesThatCollideWith(Level.PLAYER)
        Debugger.pushInfo(`Total entities that collide with the player: ${entitiesThatCollideWithPlayer.length}`)
        if (entitiesThatCollideWithPlayer.length > 0) {
            const names = []
            entitiesThatCollideWithPlayer.forEach(_entity => names.push(_entity.getType()))
            Debugger.pushInfo(`Entities that collide with the player: ${names}`)
        }
    }


    update() {
        // update all the entities
        this.#entities.forEach(entity => {
            if (!entity.removeFromWorld) {
                entity.update();
            }
        });
        // remove entities from world if needed
        for (let i = this.#entities.length - 1; i >= 0; --i) {
            if (this.#entities[i].removeFromWorld) {
                this.#entities.splice(i, 1);
            }
        }
        //output debug information
        if (Debugger.isDebugging) {
            this.logDebugInfo()
        }

        // Trash Regeneration Logic
        if (this.getParameter("trash_regeneration")) {
            this.trashRegenTimer += GAME_ENGINE.clockTick;
            // 3 real minutes = 180 seconds
            if (this.trashRegenTimer > 180) {
                const currentTrashCount = this.#entities.filter(e => e instanceof Trash).length;
                const maxTrash = this.getParameter("max_trash") || 15;

                if (currentTrashCount < maxTrash) {
                    this.spawnRandomTrash();
                }
                this.trashRegenTimer = 0; // Reset even if spawn fails or is full
            }
        }
    }

    processTriggers(_data) {
        if (_data.type.localeCompare("teleportation") === 0 && Transition.isNotActivated()) {
            Transition.start(() => {
                try {
                    console.log(`Teleporting to: ${_data["destinationLevel"]} at ${_data["destinationX"]}, ${_data["destinationY"]}`);
                    GAME_ENGINE.enterLevel(_data["destinationLevel"])
                    const currentLevel = GAME_ENGINE.getCurrentLevel();
                    if (!currentLevel) throw new Error(`Level ${_data["destinationLevel"]} failed to load.`);
                    
                    Level.PLAYER.setMapReference(currentLevel)
                    Level.#setPlayerCoordinate(_data["destinationX"], _data["destinationY"])
                } catch (error) {
                    console.error("Critical transition error:", error);
                    // Force the screen to open so the player isn't stuck back-stage
                    Transition.forceFinish();
                }
            })
        } else if (_data.type.localeCompare("weather_forecast") === 0) {
            const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
            if (MessageButton.draw(
                GAME_ENGINE.ctx, "Watch TV", _fontSize,
                Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
            )) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                    GAME_ENGINE.getPlayerUi().openWeather();
                    Controller.mouse.leftClick = false;
                }
            }
        } else if (_data.type.localeCompare("animated_tv") === 0) {
            const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
            if (MessageButton.draw(
                GAME_ENGINE.ctx, "Watch TV", _fontSize,
                Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
            )) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                    GAME_ENGINE.getPlayerUi().openAnimatedTV("./images/ui/farming.gif");
                    Controller.mouse.leftClick = false;
                }
            }
        } else if (_data.type.localeCompare("dialog") === 0) {
            const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
            if (MessageButton.draw(
                GAME_ENGINE.ctx, "Interact", _fontSize,
                Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
            )) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                    Dialogues.update(_data.key);
                    Controller.mouse.leftClick = false;
                }
            }
        }
    }

    draw(ctx) {
        // fix offset x
        if (Level.PLAYER.getPixelRight() + this.getPixelX() > ctx.canvas.width * 0.9) {
            this.setPixelX(this.getPixelX() - Math.floor(Level.PLAYER.getMovingSpeedX() * 1.5))
        } else if (Level.PLAYER.getPixelX() + this.getPixelX() < ctx.canvas.width * 0.1) {
            this.setPixelX(this.getPixelX() + Math.floor(Level.PLAYER.getMovingSpeedX() * 1.5))
        }
        this.setPixelX(Math.max(Math.min(this.getPixelX(), 0), ctx.canvas.width - this.getWidth()))
        // fix offset y
        if (Level.PLAYER.getPixelBottom() + this.getPixelY() > ctx.canvas.height * 0.85) {
            this.setPixelY(this.getPixelY() - Math.floor(Level.PLAYER.getMovingSpeedY() * 1.5))
        } else if (Level.PLAYER.getPixelY() + this.getPixelY() < ctx.canvas.height * 0.1) {
            this.setPixelY(this.getPixelY() + Math.floor(Level.PLAYER.getMovingSpeedY() * 1.5))
        }
        this.setPixelY(Math.max(Math.min(this.getPixelY(), 0), ctx.canvas.height - this.getHeight()))
        // draw map group layers
        this.drawTiles(
            ctx,
            Math.floor(-this.getPixelX() / this.getTileSize()), Math.ceil((ctx.canvas.width - this.getPixelX()) / this.getTileSize()),
            Math.floor(-this.getPixelY() / this.getTileSize()), Math.ceil((ctx.canvas.height - this.getPixelY()) / this.getTileSize()),
            0, this.getParameter("groupLevelEndAtIndex")
        )
        // sort entities based on coordinates
        this.#entities.sort(
            function (firstItem, secondItem) {
                if (firstItem.getBlockY() < secondItem.getBlockY()) {
                    return -1
                } else if (firstItem.getBlockY() > secondItem.getBlockY()) {
                    return 1
                } else if (firstItem.getBlockX() < secondItem.getBlockX()) {
                    return -1
                } else if (firstItem.getBlockX() > secondItem.getBlockX()) {
                    return 1
                } else {
                    return 0
                }
            }
        );
        // Draw all the entities
        this.#entities.forEach(entity => {
            entity.display(ctx, this.getPixelX(), this.getPixelY())
            if (Debugger.isDebugging) {
                const _hitBox = entity.getPixelHitBox()
                ctx.strokeRect(_hitBox.x + this.getPixelX(), _hitBox.y + this.getPixelY(), _hitBox.width, _hitBox.height)
            }
        });
        // If there is top layers on the top of ground layers
        const theGroupLevelEndAtIndex = this.getParameter("groupLevelEndAtIndex")
        if (theGroupLevelEndAtIndex != null) {
            this.drawTiles(
                ctx,
                Math.max(Math.floor(-this.getPixelX() / this.getTileSize()), 0), Math.min(Math.ceil((ctx.canvas.width - this.getPixelX()) / this.getTileSize()), this.getColumn()),
                Math.max(Math.floor(-this.getPixelY() / this.getTileSize()), 0), Math.min(Math.ceil((ctx.canvas.height - this.getPixelY()) / this.getTileSize()), this.getRow()),
                theGroupLevelEndAtIndex, null
            )
        }
        // if this is an interior scene
        if (this.getParameter("interior") == null || this.getParameter("interior") === false) {
            // adding affect for day night cycle
            if (!(DateTimeSystem.getHour() >= 6 && DateTimeSystem.getHour() < 18)) {
                ctx.beginPath();
                if (this.getParameter("light_sources") != null) {
                    this.getParameter("light_sources").forEach(_spot => {
                        ctx.arc(Math.ceil(this.getTilePixelX(_spot[0]) - 0.1), Math.ceil(this.getTilePixelY(_spot[1] - 0.1)), Math.ceil(_spot[2] * this.getTileSize() * 0.8), 0, Math.PI * 2)
                        ctx.closePath()
                    })
                }
                if (DateTimeSystem.getHour() >= 18 && DateTimeSystem.getHour() <= 22) {
                    ctx.fillStyle = `rgba(5,18,45, ${(DateTimeSystem.getHour() - 18) * 0.2})`;
                } else if (DateTimeSystem.getHour() >= 2 && DateTimeSystem.getHour() <= 6) {
                    ctx.fillStyle = `rgba(5,18,45, ${0.8 - (DateTimeSystem.getHour() - 2) * 0.2})`;
                } else {
                    ctx.fillStyle = "rgba(5,18,45, 0.8)";
                }
                ctx.rect(ctx.canvas.width, 0, -ctx.canvas.width, ctx.canvas.height);
                ctx.fill();
                if (this.getParameter("light_sources") != null) {
                    this.getParameter("light_sources").forEach(_spot => {
                        ctx.beginPath();
                        const [thePixelX, thePixelY, theRadius] = [this.getTilePixelX(_spot[0]), this.getTilePixelY(_spot[1] - 0.1), Math.ceil(_spot[2] * this.getTileSize())]
                        let radialGradient = ctx.createRadialGradient(thePixelX, thePixelY, 1, thePixelX, thePixelY, theRadius);
                        radialGradient.addColorStop(0, 'rgba(255,153,51,0.5)');
                        radialGradient.addColorStop(0.65, 'rgba(255,178,102,0.3)');
                        radialGradient.addColorStop(1, 'rgba(255,204,153,0)');
                        ctx.arc(thePixelX, thePixelY, theRadius, 0, Math.PI * 2);
                        ctx.fillStyle = radialGradient;
                        ctx.fill();
                    })
                }
            }
        }
        const entitiesThatCollideWithPlayer = this.getEntitiesThatCollideWith(Level.PLAYER)
        if (entitiesThatCollideWithPlayer.length > 0) {
            if (entitiesThatCollideWithPlayer[0] instanceof Npc) {
                if (!["Nader", "Omar", "Ramy", "Menna"].includes(entitiesThatCollideWithPlayer[0].getName())) {
                    const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
                    if (Level.PLAYER.notDisablePlayerController()) {
                        const isHovered = MessageButton.draw(
                            GAME_ENGINE.ctx, "Interact (V)", _fontSize,
                            Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
                        );
                        if ((isHovered && !Controller.mouse_prev.leftClick && Controller.mouse.leftClick) || Controller.keys["KeyV"]) {
                            entitiesThatCollideWithPlayer[0].interact();
                            Controller.mouse.leftClick = false;
                            Controller.keys["KeyV"] = false;
                        }
                    }
                }
            } else if (entitiesThatCollideWithPlayer[0] instanceof Chest) {
                if (Level.PLAYER.notDisablePlayerController()) {
                    const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
                    if (MessageButton.draw(
                        GAME_ENGINE.ctx, "Open", _fontSize,
                        Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
                    )) {
                        if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                            GAME_ENGINE.getPlayerUi().openChest(entitiesThatCollideWithPlayer[0]);
                        }
                    }
                }
            } else if (entitiesThatCollideWithPlayer[0] instanceof Trash) {
                if (Level.PLAYER.notDisablePlayerController()) {
                    const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2
                    MessageButton.draw(
                        GAME_ENGINE.ctx, "Pick up (F)", _fontSize,
                        Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
                    );
                    if (Controller.keys["KeyF"]) {
                        entitiesThatCollideWithPlayer[0].interact(Level.PLAYER);
                        Controller.keys["KeyF"] = false; // consume input
                    }
                }
            } else if (entitiesThatCollideWithPlayer[0] instanceof Animal && entitiesThatCollideWithPlayer[0].isEscaped()) {
                if (Level.PLAYER.notDisablePlayerController()) {
                    const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2
                    MessageButton.draw(
                        GAME_ENGINE.ctx, "Catch (F)", _fontSize,
                        Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
                    );
                    if (Controller.keys["KeyF"]) {
                        entitiesThatCollideWithPlayer[0].interact(Level.PLAYER);
                        Controller.keys["KeyF"] = false; // consume input
                    }
                }
            }
        }
        // Draw all the teleportation points
        if (Level.PLAYER.notDisablePlayerController()) {
            this.getParameter("triggers").forEach(_pos => {
                    const _trigger = new Trigger(
                        this.getTilePixelX(_pos.x), this.getTilePixelY(_pos.y),
                        this.getTileSize() * _pos.width, this.getTileSize() * _pos.height,
                        _pos.x, _pos.y, _pos.width, _pos.height,
                    )
                    if (_trigger.collideWith(Level.PLAYER)) {
                        this.processTriggers(_pos)
                    } else if (Debugger.isDebugging) {
                        ctx.strokeStyle = 'red';
                    }
                    if (Debugger.isDebugging) _trigger.draw(ctx)
                }
            )
        }
        // play bgm
        if (!Level.STORY_PLAYING && Level.BGM.localeCompare("$NO_MUSIC$") !== 0) {
            if (ASSET_MANAGER.playMusic(Level.BGM)) this.updateLevelMusic()
        }
    };
}