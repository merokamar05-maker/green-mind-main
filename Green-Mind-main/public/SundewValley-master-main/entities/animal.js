class Animal extends Creature {

    #current_action_count_down
    #spawnBlockX
    #spawnBlockY
    #isEscaped = false
    static #SHOP_WANDER_RADIUS = 3

    constructor(type, subType, x, y, mapRef) {
        super("animals", type, subType, x, y, mapRef);
        this.#current_action_count_down = 0
        this.#spawnBlockX = x
        this.#spawnBlockY = y
        this.#isEscaped = false
    }

    setIsEscaped(val) {
        this.#isEscaped = val;
    }

    isEscaped() {
        return this.#isEscaped;
    }

    interact(playerRef) {
        if (!this.#isEscaped) return;
        
        // Catch the animal
        playerRef.obtainItem(this.getType(), 1);
        this.removeFromWorld = true;
        ASSET_MANAGER.playSound("Gravel_hit1.ogg");
        
        // Mark as caught for the current period (the level-spawning logic will check save data)
        const currentLevel = this.getMapReference();
        if (currentLevel.onAnimalCaught) {
            currentLevel.onAnimalCaught(this);
        }
        if (typeof AchievementManager !== "undefined") {
            AchievementManager.notifyAnimalCaught();
        }
    }

    update() {
        if (this.#current_action_count_down > 0) {
            this.#current_action_count_down -= 1
        } else {
            this.setCurrentMovingSpeedX(0)
            this.setCurrentMovingSpeedY(0)
            switch (getRandomIntInclusive(0, 4)) {
                case 0:
                    this.setCurrentAction("idle")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // up
                case 1:
                    this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // down
                case 2:
                    this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // left
                case 3:
                    this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                    this.setDirectionFacing("l")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // right
                case 4:
                    this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                    this.setDirectionFacing("r")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
            }
        }

        // Flee behavior for escaped animals
        if (this.#isEscaped && Level.PLAYER) {
            const playerDist = Math.sqrt(Math.pow(this.getPixelX() - Level.PLAYER.getPixelX(), 2) + Math.pow(this.getPixelY() - Level.PLAYER.getPixelY(), 2));
            const fleeDistance = this.getMapReference().getTileSize() * 7;
            
            if (playerDist < fleeDistance) {
                // Move away from player
                const dx = this.getPixelX() - Level.PLAYER.getPixelX();
                const dy = this.getPixelY() - Level.PLAYER.getPixelY();
                const angle = Math.atan2(dy, dx);
                
                const fleeSpeed = 4; // Slightly faster flee speed
                this.setCurrentMovingSpeedX(Math.cos(angle) * fleeSpeed);
                this.setCurrentMovingSpeedY(Math.sin(angle) * fleeSpeed);
                this.setCurrentAction("move");
                this.setDirectionFacing(this.getCurrentMovingSpeedX() < 0 ? "l" : "r");
                
                // Override the wandering countdown since we are fleeing
                this.#current_action_count_down = 10; 
            }
        }

        super.update()
        // Clamp movement to stay within a circular radius of spawn position
        // Escaped animals are NOT clamped - they roam the whole town freely
        if (!this.#isEscaped) {
            const isFarm = this.getMapReference() instanceof FarmLevel
            const wanderRadius = isFarm ? 6 : Animal.#SHOP_WANDER_RADIUS
            const tileSize = this.getMapReference().getTileSize()
            const rPixels = wanderRadius * tileSize
            const spawnXPixels = this.#spawnBlockX * tileSize
            const spawnYPixels = this.#spawnBlockY * tileSize
            
            const dx = this.getPixelX() - spawnXPixels
            const dy = this.getPixelY() - spawnYPixels
            const distSq = dx * dx + dy * dy
            
            if (distSq > rPixels * rPixels) {
                const dist = Math.sqrt(distSq)
                this.setPixelX(spawnXPixels + (dx / dist) * rPixels)
                this.setPixelY(spawnYPixels + (dy / dist) * rPixels)
            }
        }
    };

    display(ctx, offsetX, offsetY) {
        super.display(ctx, offsetX, offsetY)
    };
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}