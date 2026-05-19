class Npc extends Character {
    #waypoints
    #target_waypoint_idx
    #isSoso
    #isMovingNpc
    #prev_x
    #prev_y
    #stuck_timer

    constructor(name, x, y, mapRef) {
        const visualMapping = {
            "Sebaey": "soso",
            "Nader": "mario",
            "Omar": "7azo",
            "Ramy": "Mohamed",
            "Menna": "maya"
        };
        const visualType = visualMapping[name] || name.toLowerCase();
        super(name, visualType, x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        
        // Special scaling for the high-res images
        let widthScale = 1;
        let heightMultiplier = 1.3;
        if (name === "Grandmother") {
            widthScale = 2.5;
            heightMultiplier = 2.5;
        }

        
        this.setSize(this.getMapReference().getTileSize() * widthScale, this.getMapReference().getTileSize() * heightMultiplier)
        
        // RE-CALCULATE POSITION: After setting a custom size, we MUST re-set the block coordinates
        // because setBlockX/Y depends on the width/height which just changed. 
        // Failing to do this results in the NPC being positioned off-screen based on the old 1024x1024 size.
        this.setBlockX(x)
        this.setBlockY(y)

        if (name === "Grandmother") {

            // Adjust hitbox for the larger sprite
            this.customHitBox = {x: 0.25, y: 0.5, width: 1.5, height: 2}
        } else {
            this.customHitBox = {x: -1, y: -1, width: 3, height: 3}
        }

        this.#isSoso = name === "Soso"
        this.#isMovingNpc = ["7azo", "Jannah", "Kinzy", "Mario", "Nader", "Omar", "Ramy", "Menna"].includes(name) || this.#isSoso
        if (this.#isMovingNpc) {
            let baseWaypoints = this.#isSoso ? [[20, 45], [40, 45], [40, 60], [20, 60]] : [[15, 42], [45, 42], [45, 63], [15, 63]];
            
            // Reverse direction for Kinzy and Mario to make them move opposite to the others
            if (name === "Kinzy" || name === "Mario") {
                baseWaypoints = [[15, 42], [15, 63], [45, 63], [45, 42]];
            } else if (["Nader", "Omar", "Ramy", "Menna"].includes(name)) {
                // Move in a large rectangle (10 steps)
                baseWaypoints = [[x, y], [x + 10, y], [x + 10, y + 10], [x, y + 10]];
            }
            
            this.#waypoints = baseWaypoints;
            
            // Set initial target waypoint based on starting position to ensure they don't all cluster at one point
            if (name === "7azo" || this.#isSoso) this.#target_waypoint_idx = 1;      // Moving from NW to NE
            else if (name === "Jannah") this.#target_waypoint_idx = 2;           // Moving from NE to SE
            else if (name === "Kinzy") this.#target_waypoint_idx = 3;           // Moving from SE to NE (Reversed)
            else if (name === "Mario") this.#target_waypoint_idx = 2;           // Moving from SW to SE (Reversed)
            else if (["Nader", "Omar", "Ramy", "Menna"].includes(name)) this.#target_waypoint_idx = 1; // start by moving right
            else this.#target_waypoint_idx = 0;
 
            this.#prev_x = x
            this.#prev_y = y
            this.#stuck_timer = 0
            const speed = this.#isSoso ? 1.5 : (["Nader", "Omar", "Ramy", "Menna"].includes(name) ? 2 : 3)
            this.setMovingSpeedX(speed) // Configurable walking speed
            this.setMovingSpeedY(speed)
        }
        this.dailyClosing()
    }

    interact() {
        const name = this.getName();
        if (["Nader", "Omar", "Ramy", "Menna"].includes(name)) return;

        // Track friendship & daily quest progress
        FriendshipManager.addTalkPoints(name);
        QuestManager.notifyTalk(name);
        
        if (name === "Grandmother") {
            if (Dialogues.isGrandmotherSick()) {
                Dialogues.update("Grandmother_interact1", this)
            } else {
                Dialogues.update("Grandmother_healthy_start", this)
            }
        } else if (name === "Mimo") {
            Dialogues.MIMO_INTERACTION_COUNT++;
            const stage = Math.floor((Dialogues.MIMO_INTERACTION_COUNT - 1) / 2);
            
            if (stage === 0) {
                Dialogues.update("Mimo_interact1", this);
            } else if (stage === 1) {
                Dialogues.update("Mimo_stage2_1", this);
            } else if (stage === 2) {
                Dialogues.update("Mimo_stage3_1", this);
            } else {
                Dialogues.update("Mimo_stage4_1", this);
            }
        } else if (name === "Soso") {
            if (Dialogues.SOSO_GENEROSITY_LEVEL <= 2) {
                Dialogues.update("Soso_interact1", this);
            } else if (Dialogues.SOSO_GENEROSITY_LEVEL <= 5) {
                Dialogues.update("Soso_spy_stage_1", this);
            } else if (Dialogues.SOSO_GENEROSITY_LEVEL === 6) {
                Dialogues.update("Soso_reward_stage_1", this);
                Dialogues.SOSO_GENEROSITY_LEVEL++; // Move to grateful stage after one reward
            } else {
                Dialogues.update("Soso_grateful_1", this);
            }
        } else if (name === "Mohamed") {
            Dialogues.Mohamed_INTERACTION_COUNT++;
            const stage = (Dialogues.Mohamed_INTERACTION_COUNT - 1) % 8;
            
            if (stage === 0) {
                Dialogues.update("Mohamed_interact1", this);
            } else if (stage === 1) {
                Dialogues.update("Mohamed_stage2_1", this);
            } else if (stage === 2) {
                Dialogues.update("Mohamed_stage3_1", this);
            } else if (stage === 3) {
                Dialogues.update("Mohamed_stage4_1", this);
            } else if (stage === 4) {
                Dialogues.update("Mohamed_stage5_1", this);
            } else if (stage === 5) {
                Dialogues.update("Mohamed_stage6_1", this);
            } else if (stage === 6) {
                Dialogues.update("Mohamed_stage7_1", this);
            } else {
                Dialogues.update("Mohamed_stage8_1", this);
            }
        } else if (name === "Sebaey") {
            Dialogues.SEBAEY_INTERACTION_COUNT++;
            const stage = (Dialogues.SEBAEY_INTERACTION_COUNT - 1) % 4;
            
            if (stage === 0) {
                Dialogues.update("Sebaey_interact1", this);
            } else if (stage === 1) {
                Dialogues.update("Sebaey_stage2_1", this);
            } else if (stage === 2) {
                Dialogues.update("Sebaey_stage3_1", this);
            } else {
                Dialogues.update("Sebaey_stage4_1", this);
            }
        } else if (name === "Zozo") {
            Dialogues.ZOZO_INTERACTION_COUNT++;
            if (Dialogues.ZOZO_INTERACTION_COUNT === 1) {
                Dialogues.update("Zozo_escaped_animals", this);
            } else {
                Dialogues.update("Zozo_interact1", this);
            }
        } else if (name === "Recycler") {
            Dialogues.RECYCLER_INTERACTION_COUNT++;
            if (Dialogues.RECYCLER_INTERACTION_COUNT === 1) {
                Dialogues.update("Recycler_interact1", this);
            } else {
                // Cycle through the repeat tips (repeat1, repeat2, repeat3)
                const stage = (Dialogues.RECYCLER_INTERACTION_COUNT - 2) % 3;
                if (stage === 0) {
                    Dialogues.update("Recycler_interact_repeat1", this);
                } else if (stage === 1) {
                    Dialogues.update("Recycler_interact_repeat2", this);
                } else {
                    Dialogues.update("Recycler_interact_repeat3", this);
                }
            }
        } else {
            Dialogues.update(name + "_interact1", this)
        }
    }

    update() {
        if (this.#isMovingNpc) {
            // Stop movement if the dialogue is currently being initiated by this NPC
            if (Dialogues.isAnyDialoguePlaying() && Dialogues.getInitBy() === this) {
                this.setCurrentMovingSpeedX(0);
                this.setCurrentMovingSpeedY(0);
                this.setCurrentAction("idle");
                this.#stuck_timer = 0; // Reset timer while talking
            } else {
                const target = this.#waypoints[this.#target_waypoint_idx];
                const dx = target[0] - this.getBlockX();
                const dy = target[1] - this.getBlockY();
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < 0.04) { // Reached waypoint (distance < 0.2)
                    this.#target_waypoint_idx = (this.#target_waypoint_idx + 1) % this.#waypoints.length;
                    this.#stuck_timer = 0;
                } else {
                    // Anti-Stuck Detection
                    const movedDistSq = Math.pow(this.getBlockX() - this.#prev_x, 2) + Math.pow(this.getBlockY() - this.#prev_y, 2);
                    // If trying to move but not actually moving
                    if ((this.getCurrentMovingSpeedX() !== 0 || this.getCurrentMovingSpeedY() !== 0) && movedDistSq < 0.0001) {
                        this.#stuck_timer++;
                        if (this.#stuck_timer > 100) { // Capped at ~1.5s (assuming 60fps)
                            this.#target_waypoint_idx = (this.#target_waypoint_idx + 1) % this.#waypoints.length;
                            this.#stuck_timer = 0;
                        }
                    } else {
                        this.#stuck_timer = 0;
                    }
                    this.#prev_x = this.getBlockX();
                    this.#prev_y = this.getBlockY();

                    // Move toward current waypoint
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // Choose direction based on major axis
                        this.setCurrentMovingSpeedX(dx > 0 ? this.getMovingSpeedX() : -this.getMovingSpeedX());
                        this.setCurrentMovingSpeedY(0);
                        this.setDirectionFacing(dx > 0 ? "r" : "l");
                    } else {
                        this.setCurrentMovingSpeedY(dy > 0 ? this.getMovingSpeedY() : -this.getMovingSpeedY());
                        this.setCurrentMovingSpeedX(0);
                        // Standard characters only have 'l' and 'r' animations
                        // so we determine 'l' or 'r' even when moving vertically to keep it visually consistent
                        if (this.getCurrentMovingSpeedX() === 0) {
                            // Keep current horizontal direction or default to "r" if newly started moving down/up
                        }
                    }
                    this.setCurrentAction("move");
                }
            }
        }
        super.update();
    }

    dailyClosing() {
        if (this.getName().localeCompare("Maya") === 0) {
            this.clearInventory()
            this.setMoney(getRandomIntInclusive(2000, 5000))
            const _allKeys = Object.keys(InventoryItems.PRICES)
            // Filter to only include crops and seeds (exclude animals and tools)
            const _cropsAndKeys = _allKeys.filter(key => 
                key.endsWith("_seed") || 
                ["pumpkin", "cabbage", "carrot", "grain", "potato", "strawberry", "tomato", "eggplant", "lavender", "corn", "pea"].includes(key)
            )
            for (let i = 0; i < 50; i++) {
                this.obtainItem(_cropsAndKeys[_cropsAndKeys.length * Math.random() << 0], getRandomIntInclusive(1, 3))
            }
        } else if (this.getName().localeCompare("Zozo") === 0) {
            this.clearInventory()
            this.setMoney(getRandomIntInclusive(5000, 10000))
            const _animalKeys = ["chicken", "cow", "goat", "pig", "sheep"]
            _animalKeys.forEach(key => {
                this.obtainItem(key, 5) // Give Zozo 5 of each animal to start with
            })
        } else if (this.getName().localeCompare("Maryoma") === 0) {
            this.clearInventory()
            this.setMoney(getRandomIntInclusive(1000, 3000))
            const _drinkKeys = ["water", "orange_juice", "apple_juice", "pineapple_juice"]
            _drinkKeys.forEach(key => {
                this.obtainItem(key, 10) // Give Maryoma 10 of each drink to sell
            })
        }
    }
}
