class Player extends Character {
    // whether the player is in idle or not
    #isIdle
    #itemBar
    #karma
    #arrowVisible
    #idleTimer

    constructor(name, x, y, mapRef) {
        super(name, "player", x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1.5, this.getMapReference().getTileSize() * 1.5)
        this.#isIdle = true
        this.ishidden = false
        this.#itemBar = {}
        this.#karma = 0
        this.#arrowVisible = true // Show arrow at start
        this.#idleTimer = 0
    }

    getKarma() {
        return this.#karma;
    }

    addKarma(amount) {
        this.#karma += amount;
        if (this.#karma >= 100) {
            this.#karma = 0;
            this.earnMoney(500); 
            // We could play a sound here if we want!
            ASSET_MANAGER.playSound("Gravel_hit3.ogg"); // Use a distinct sound for reward
        }
    }


    getItemBar() {
        return this.#itemBar
    }

    clearItemBar() {
        this.#itemBar = {};
    }

    refillItemBarFromInventory() {
        if (Object.keys(this.#itemBar).length >= ItemBarUI.ITEMS_PER_ROW) return;
        
        const inventory = this.getInventory();
        const invKeys = Object.keys(inventory);
        if (invKeys.length > 0) {
            const firstKey = invKeys[0];
            const amount = inventory[firstKey].amount;
            // Take out of backpack
            super.tryUseItem(firstKey, amount);
            // Put into item bar
            this.#itemBar[firstKey] = { amount: amount };
        }
    }

    obtainItem(key, num = 1) {
        if (super.hasItemInInventory(key)) {
            super.obtainItem(key, num)
        } else if (this.#itemBar[key] != null) {
            this.#itemBar[key]["amount"] += num
        } else if (Object.keys(this.#itemBar).length < ItemBarUI.ITEMS_PER_ROW) {
            this.#itemBar[key] = {"amount": num}
        } else {
            super.obtainItem(key, num)
        }
    }

    tryUseItem(key, num = 1) {
        if (super.hasItemInInventory(key)) {
            return super.tryUseItem(key, num)
        } else if (this.#itemBar[key] != null && this.#itemBar[key]["amount"] >= num) {
            this.#itemBar[key]["amount"] -= num
            if (this.#itemBar[key]["amount"] === 0) {
                delete this.#itemBar[key]
                this.refillItemBarFromInventory();
            }
            return true
        }
        return false;
    }

    putItemFromItemBarIntoTargetInventory(key, targetRef, amount = null) {
        if (amount == null || amount > this.#itemBar[key]["amount"]) {
            amount = this.#itemBar[key]["amount"]
        }
        targetRef.obtainItem(key, amount)
        this.#itemBar[key]["amount"] -= amount
        if (this.#itemBar[key]["amount"] === 0) {
            delete this.#itemBar[key]
        }
    }


    putItemIntoInventory(key, amount = null) {
        if (amount == null || amount > this.#itemBar[key]["amount"]) {
            amount = this.#itemBar[key]["amount"]
        }
        super.obtainItem(key, amount)
        this.#itemBar[key]["amount"] -= amount
        if (this.#itemBar[key]["amount"] === 0) {
            delete this.#itemBar[key]
        }
    }

    takeItemOutOfInventory(key, amount = null) {
        if (amount == null || amount > this.getInventory()[key]["amount"]) {
            amount = this.getInventory()[key]["amount"]
        }
        this.getInventory()[key]["amount"] -= amount
        if (this.getInventory()[key]["amount"] === 0) {
            delete this.getInventory()[key]
        }
        if (this.#itemBar[key] == null) {
            this.#itemBar[key] = {"amount": amount}
        } else {
            this.#itemBar[key]["amount"] += amount
        }
    }

    #checkNotLoopAnimation(key, action) {
        if (Controller.keys[key] === true) {
            // Check for tutorial video trigger on first press
            const toolTutorials = {
                "KeyQ": "./Game_Guide/Water.gif",
                "KeyE": "./Game_Guide/Dig.gif",
                "KeyC": "./Game_Guide/Harvest.gif"
            };
            
            if (toolTutorials[key] && !SaveManager.hasSeenVideo(key)) {
                GAME_ENGINE.getPlayerUi().openAnimatedTV(toolTutorials[key]);
                SaveManager.markVideoAsSeen(key);
                Controller.keys[key] = false; // Reset key to prevent immediate action after video
                return false;
            }

            this.setCurrentAction(action)
            this.#isIdle = false
            return true
        } else {
            this.getAnimation(action + "_l").resetElapsedTime()
            this.getAnimation(action + "_r").resetElapsedTime()
            return false
        }
    }

    #checkSpecialAction() {
        // Block farm actions entirely when exhausted
        if (this.getMapReference() instanceof FarmLevel && EnergyManager.isExhausted()) {
            return true; // skip all special actions
        }
        // Consume energy on initial key press (rising edge)
        if (this.notDisablePlayerController()) {
            if (Controller.keys["KeyQ"] && !Controller.keys_prev["KeyQ"]) {
                EnergyManager.consume(4);
                ASSET_MANAGER.playSound("Empty_water_bucket1.ogg");
            }
            if (Controller.keys["KeyE"] && !Controller.keys_prev["KeyE"]) {
                EnergyManager.consume(4);
                ASSET_MANAGER.playSound("Gravel_hit1.ogg");
            }
            if (Controller.keys["KeyC"] && !Controller.keys_prev["KeyC"]) {
                EnergyManager.consume(4);
                ASSET_MANAGER.playSound("Gravel_hit1.ogg");
            }
        }

        const res = !this.#checkNotLoopAnimation("KeyQ", "water")
            && !this.#checkNotLoopAnimation("KeyE", "dig")
            && !this.#checkNotLoopAnimation("KeyC", "cut");
            
        return res;
    }

    notDisablePlayerController() {
        return Transition.isNotActivated() && GAME_ENGINE.getPlayerUi().noUiIsOpening() && !Dialogues.isAnyDialoguePlaying() && !this.ishidden
    }

    update() {
        if (this.ishidden) return
        this.#isIdle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // for dig action, try to convert grass to dirt
        if (this.isCurrentAction("dig") && this.getCurrentAnimation().currentFrame() === 1) {
            ASSET_MANAGER.playSound(`Gravel_hit${getRandomIntInclusive(1, 4)}.ogg`)
            if (this.getMapReference() instanceof FarmLevel) {
                // Energy consumed in #checkSpecialAction for single-trigger
                this.getMapReference().tryConvertTileToDirt(this.getBlockX(), this.getBlockY())
            }
        }
        // for water action, try to water the ground
        else if (this.isCurrentAction("water") && this.getCurrentAnimation().currentFrame() === 1) {
            ASSET_MANAGER.playSound(`Empty_water_bucket${getRandomIntInclusive(1, 3)}.ogg`)
            if (this.getMapReference() instanceof FarmLevel) {
                // Energy consumed in #checkSpecialAction for single-trigger
                this.getMapReference().tryConvertTileToWateredDirt(this.getBlockX(), this.getBlockY())
            }
        }
        // for cut action, try to harvest the crop
        else if (this.isCurrentAction("cut") && this.getCurrentAnimation().currentFrame() === 1) {
            ASSET_MANAGER.playSound(`Gravel_hit${getRandomIntInclusive(1, 4)}.ogg`)
            if (this.getMapReference() instanceof FarmLevel) {
                const _crop = this.getMapReference().getCrop(this.getBlockX(), this.getBlockY())
                if (_crop != null && _crop.isMatured()) {
                    _crop.removeFromWorld = true
                    // obtain a random amount of crop
                    this.obtainItem(_crop.getType(), getRandomIntInclusive(1, 3))
                    // obtain a random amount of seed for that crop
                    this.obtainItem(_crop.getType() + "_seed", getRandomIntInclusive(1, 2))
                    // notify quest system
                    QuestManager.notifyHarvest(_crop.getType())
                    AchievementManager.notifyHarvest();
                }
            }
        }
        // check special action
        if (this.notDisablePlayerController() && this.#checkSpecialAction()) {
            // move left or right
            if (Controller.left === true) {
                this.setDirectionFacing("l")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                this.#isIdle = false
            } else if (Controller.right === true) {
                this.setDirectionFacing("r")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                this.#isIdle = false
            }
            // move up or down
            if (Controller.up === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                this.#isIdle = false
            } else if (Controller.down === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                this.#isIdle = false
            }
        }
        if (this.#isIdle) {
            this.setCurrentAction("idle")
            this.#idleTimer += GAME_ENGINE.clockTick;
            if (this.#idleTimer > 3.0) { // Delay appearance by 3 seconds
                this.#arrowVisible = true;
            }
        } else {
            this.#idleTimer = 0;
            this.#arrowVisible = false;
        }

        // Eat food/veggies/drinks with R key
        if (this.notDisablePlayerController() && Controller.keys["KeyR"] && !Controller.keys_prev["KeyR"]) {
            const consumeKeys = Object.keys(this.#itemBar).filter(k => 
                InventoryItems.isFood(k) || InventoryItems.isVegetable(k) || InventoryItems.isDrink(k)
            );
            if (consumeKeys.length > 0) {
                const itemKey = consumeKeys[0];
                const energyGain = EnergyManager.ENERGY_BY_ITEM[itemKey] || 15;
                this.tryUseItem(itemKey, 1);
                EnergyManager.restore(energyGain);
                ASSET_MANAGER.playSound("Gravel_hit3.ogg");
                Controller.keys["KeyR"] = false;

                // Achievement notification
                if (InventoryItems.isDrink(itemKey)) {
                    AchievementManager.notifyDrink();
                }
            }
        }

        // Achievement: track money
        AchievementManager.notifyMoney(this.getMoney());

        super.update()
    };

    display(ctx, offsetX, offsetY) {
        if (this.ishidden) return;
        super.display(ctx, offsetX, offsetY);

        if (this.#arrowVisible) {
            const bounce = Math.sin(Date.now() / 200) * 10;
            const arrowX = this.getPixelX() + offsetX + this.getWidth() / 2;
            const arrowY = this.getPixelY() + offsetY - 20 + bounce;

            ctx.save();
            ctx.fillStyle = "#FFD700"; // Gold color
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(arrowX - 15, arrowY - 20);
            ctx.lineTo(arrowX + 15, arrowY - 20);
            ctx.lineTo(arrowX, arrowY + 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }
    }
}