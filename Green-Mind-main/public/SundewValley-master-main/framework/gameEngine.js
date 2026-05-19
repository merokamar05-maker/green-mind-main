// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    #levels
    #currentLevelName
    #ui
    paused = false

    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.#ui = null;
        this.#levels = {}
        this.saveData = null;
    };

    getCurrentLevel() {
        return this.#levels[this.#currentLevelName]
    }

    getPlayerUi() {
        return this.#ui
    }

    getCurrentLevelName() {
        return this.#currentLevelName
    }

    enterLevel(name) {
        this.#currentLevelName = name
        if (this.#currentLevelName.localeCompare("farm") === 0) {
            this.#currentLevelName += `_${DateTimeSystem.getSeason()}`
        }
        if (this.getCurrentLevel() == null) {
            const levelPath = `./levels/${this.#currentLevelName}.json`
            this.#levels[this.#currentLevelName] = this.#currentLevelName.startsWith("farm_") ? new FarmLevel(levelPath) : this.#currentLevelName.startsWith("bedroom") ? new Bedroom(levelPath) : new Level(levelPath)
            this.getCurrentLevel().initEntities()
        }
        
        // Apply save data if it exists for this level
        if (this.saveData && this.saveData.world && this.saveData.world.farmModifications && this.#currentLevelName.startsWith("farm_")) {
            SaveManager.applyModifications(this.getCurrentLevel(), this.saveData.world.farmModifications);
        }

        console.log(`Entering level: ${this.#currentLevelName}`);
        this.getCurrentLevel().onEnter()
        console.log(`Level ${this.#currentLevelName} onEnter() finished.`);
        this.getCurrentLevel().updateLevelMusic()
        
        // Ensure player is added to the current level's entity list (especially for cached levels)
        if (Level.PLAYER) {
            Level.PLAYER.setMapReference(this.getCurrentLevel());
            this.getCurrentLevel().addEntity(Level.PLAYER);
        }

        // Restore player position and stats if this is the initial load
        if (this.saveData && this.saveData.player && Level.PLAYER && name !== "main_menu") {
            const p = this.saveData.player;
            Level.PLAYER.setMoney(p.money);
            if (Level.PLAYER.addKarma) Level.PLAYER.addKarma(p.karma - Level.PLAYER.getKarma());
            
            // Clear default items before restoring save to prevent overflow
            Level.PLAYER.clearInventory();
            Level.PLAYER.clearItemBar();
            
            // Restore inventory and itemBar safely
            if (p.inventory) {
                const currentInv = Level.PLAYER.getInventory();
                Object.keys(p.inventory).forEach(key => currentInv[key] = p.inventory[key]);
            }
            if (p.itemBar) {
                const currentBar = Level.PLAYER.getItemBar();
                Object.keys(p.itemBar).forEach(key => currentBar[key] = p.itemBar[key]);
            }

            if (name === p.level || (name.startsWith("farm_") && p.level.startsWith("farm_"))) {
                Level.teleportPlayer(p.pos.x, p.pos.y);
            }
            this.saveData.player = null; // Clear so it only happens once
        }

        this.#ui = new UserInterfaces();

        // Story Intro for Town - Plays only once per playthrough
        if (name === "town" && !SaveManager.hasSeenVideo("town")) {
            StoryIntroUI.play('./images/story/story_time2.mp4');
            SaveManager.markVideoAsSeen("town");
        }

        // Story Intro for Farmhouse (Bedroom) - Plays only once per playthrough
        if (name === "bedroom" && !SaveManager.hasSeenVideo("bedroom")) {
            StoryIntroUI.play('./images/story/story_time3.mp4');
            SaveManager.markVideoAsSeen("bedroom");
        }

        // Story Intro for Animal Shop - Plays only once per playthrough
        if (name === "animal_shop" && !SaveManager.hasSeenVideo("animal_shop")) {
            StoryIntroUI.play('./images/story/story_time4.mp4');
            SaveManager.markVideoAsSeen("animal_shop");
        }
    }

    init(ctx) {
        this.ctx = ctx;
        DateTimeSystem.init(2023);
        InventoryItems.init()
        LevelData.init()
        
        this.saveData = SaveManager.load();
        
        if (this.saveData && this.saveData.time) {
            // Restore Time and handle Offline Progress
            const savedRealTime = this.saveData.time.realTime;
            const savedTimestamp = this.saveData.time.timestamp;

            if (Number.isFinite(savedTimestamp)) {
                DateTimeSystem.getDateObject().setTime(savedTimestamp);
            }

            if (Number.isFinite(savedRealTime)) {
                const elapsedRealTimeMs = Date.now() - savedRealTime;
                if (elapsedRealTimeMs > 0) {
                    // Game progresses at 2 minutes per real second = 120 times faster
                    let catchUpGameMs = elapsedRealTimeMs * 120;
                    
                    // Cap offline progress to 30 in-game days to prevent excessive state changes or hangs
                    const maxCatchUpMs = 30 * 24 * 60 * 60 * 1000; 
                    if (catchUpGameMs > maxCatchUpMs) {
                        console.warn(`Offline progress capped from ${Math.round(catchUpGameMs/3600000)}h to 720h (30 days).`);
                        catchUpGameMs = maxCatchUpMs;
                    }
                    
                    DateTimeSystem.advanceTime(catchUpGameMs);
                }
            }

            // Restore Chests
            if (this.saveData.world && this.saveData.world.chests) {
                Chest.CHESTS = this.saveData.world.chests;
            }
        }

        this.enterLevel("main_menu");
        UserInterfaces.displayTitle = true; 


        Controller.startInput(this.ctx)
        this.timer = new Timer();
        Debugger.switchDebugMode();
    };

    start() {
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };


    draw() {
        try {
            // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // Draw the latest things first
            if (this.getCurrentLevel()) this.getCurrentLevel().draw(this.ctx)
            // Draw all the ui onto screen
            if (this.#ui) this.#ui.draw(this.ctx)
            // draw dialogue ui
            Dialogues.draw(this.ctx)
            // Draw transition animation is it is activated
            Transition.draw(this.ctx)
        } catch (error) {
            console.error("Game engine draw error:", error);
        }
    };

    update() {
        try {
            Debugger.update()
            DateTimeSystem.update(this.clockTick)
            if (Debugger.isDebugging) {
                Debugger.pushInfo(`current in game time: ${Math.round(this.timer.gameTime)}s`)
                Debugger.pushInfo(`Date: ${DateTimeSystem.toLocaleString()} ${DateTimeSystem.getSeason()}`)
                Debugger.pushInfo(`In Transition: ${!Transition.isNotActivated()}`)
            }
            if (this.getCurrentLevel()) this.getCurrentLevel().update()
            if (this.#ui) this.#ui.update()
        } catch (error) {
            console.error("Game engine update error:", error);
        }
    };

    togglePause() {
        this.paused = !this.paused;
        const pauseMenu = document.getElementById("pauseMenu");
        if (pauseMenu) {
            pauseMenu.style.display = this.paused ? "flex" : "none";
        }
    }

    loop() {
        try {
            this.clockTick = this.timer.tick();
            if (!this.paused) {
                this.update();
            }
            this.draw();
            //Controller needs to be updated at the very end!
            Controller.update();
        } catch (error) {
            console.error("Critical game loop error:", error);
            // Attempt to keep the loop going even if a frame fails
            requestAnimFrame(() => this.loop(), this.ctx.canvas);
        }
    };

}

// KV Le was here :)