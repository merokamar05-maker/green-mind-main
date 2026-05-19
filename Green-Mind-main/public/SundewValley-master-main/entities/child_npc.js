class ChildNpc extends Character {
    constructor(name, x, y, mapRef) {
        // Use "marx" as the sprite type since it's an existing character sprite
        // Replace with "child" once images/characters/child.png is created
        super(name, "marx", x, y, mapRef);
        this.setMovingSpeedX(3);
        this.setMovingSpeedY(3);
        this.setSize(this.getMapReference().getTileSize() * 0.8, this.getMapReference().getTileSize() * 1);
        this.customHitBox = { x: -0.1, y: -0.1, width: 1.1, height: 1.1 };
    }

    interact() {
        // Child NPC doesn't have dialog
    }

    update() {
        // Call creature update for movement
        super.update();

        // Find nearest trash
        const trash = this.getMapReference().getEntityUsingFilter(e => e instanceof Trash && !e.removeFromWorld);
        if (trash) {
            const dx = trash.getBlockX() - this.getBlockX();
            const dy = trash.getBlockY() - this.getBlockY();
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 0.7) {
                // Close enough to pick up
                trash.removeFromWorld = true;
                ASSET_MANAGER.playSound("Gravel_hit1.ogg");
                this.setCurrentMovingSpeedX(0);
                this.setCurrentMovingSpeedY(0);
                this.setCurrentAction("idle");
            } else {
                // Move towards trash
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.setCurrentMovingSpeedX(dx > 0 ? this.getMovingSpeedX() : -this.getMovingSpeedX());
                    this.setCurrentMovingSpeedY(0);
                    this.setDirectionFacing(dx > 0 ? "r" : "l");
                } else {
                    this.setCurrentMovingSpeedY(dy > 0 ? this.getMovingSpeedY() : -this.getMovingSpeedY());
                    this.setCurrentMovingSpeedX(0);
                    this.setDirectionFacing(dy > 0 ? "d" : "u");
                }
                this.setCurrentAction("walk");
            }
        } else {
            // No trash left, stay idle
            this.setCurrentMovingSpeedX(0);
            this.setCurrentMovingSpeedY(0);
            this.setCurrentAction("idle");
        }
    }
}
