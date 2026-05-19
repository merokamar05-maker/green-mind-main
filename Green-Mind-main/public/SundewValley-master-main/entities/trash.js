class Trash extends Entity {
    constructor(name, x, y, mapRef) {
        super("trash", "trash", null, x, y, mapRef);
        this.name = name;
        // setSize must come before setBlockX/Y because Entity constructor
        // used undefined tilewidth (JSON not preloaded), making position NaN.
        // Re-setting size then position fixes the coordinates.
        // Increased size slightly for better visibility as requested
        this.setSize(this.getMapReference().getTileSize() * 0.65, this.getMapReference().getTileSize() * 0.65);
        this.setBlockX(x);
        this.setBlockY(y);
    }

    interact(playerRef) {
        EnergyManager.consume(2);
        playerRef.obtainItem("trash", 1);
        playerRef.addKarma(5); // +5 Karma for cleaning up the world
        this.removeFromWorld = true;
        ASSET_MANAGER.playSound("Gravel_hit1.ogg");
    }


    update() {
        // Trash doesn't need to update state every frame
    }

    display(ctx, offsetX, offsetY) {
        const x = Math.round(this.getPixelX() + offsetX);
        const y = Math.round(this.getPixelY() + offsetY);
        const w = this.getWidth();
        const h = this.getHeight();

        ctx.save();

        // Subtle shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.85, w * 0.35, h * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main bag body - Gradient for "premium" look
        const bodyGradient = ctx.createRadialGradient(x + w * 0.4, y + h * 0.5, w * 0.1, x + w * 0.5, y + h * 0.65, w * 0.5);
        bodyGradient.addColorStop(0, "#6a7e4a");
        bodyGradient.addColorStop(1, "#3a4a2a");
        ctx.fillStyle = bodyGradient;
        
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.65, w * 0.4, h * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bag upper part / neck
        ctx.fillStyle = "#4a5c2e";
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.4, w * 0.28, h * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Knot/tie detail
        ctx.fillStyle = "#e8d400"; // Brighter yellow tie
        ctx.beginPath();
        ctx.arc(x + w * 0.5, y + h * 0.3, w * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
