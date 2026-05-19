class MiniMapUI {
    constructor() {
        this.margin = 20;
        this.size = 180;
        this.padding = 10;
        this.opacity = 0.8;
    }

    draw(ctx) {
        const currentLevel = GAME_ENGINE.getCurrentLevel();
        if (!currentLevel || !Level.PLAYER) return;
        
        // Only show minimap in open areas (Town, Farm)
        const isExterior = currentLevel.getParameter("interior") == null || currentLevel.getParameter("interior") === false;
        if (!isExterior) return;

        const mapRef = currentLevel.getMapReference();
        const levelW = mapRef.getWidth();
        const levelH = mapRef.getHeight();
        
        const x = this.margin;
        const y = ctx.canvas.height - this.size - this.margin - 60; // Above the item bar area if needed

        ctx.save();

        // 1. Draw Container (Glassmorphism)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        
        ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 4;
        
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, this.size, this.size, 20);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.fillRect(x, y, this.size, this.size);
            ctx.strokeRect(x, y, this.size, this.size);
        }

        // 2. Map Content Clipping
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x + 5, y + 5, this.size - 10, this.size - 10, 15);
        else ctx.rect(x + 5, y + 5, this.size - 10, this.size - 10);
        ctx.clip();

        // Background color for the map area
        ctx.fillStyle = "rgba(0, 40, 0, 0.3)";
        ctx.fillRect(x, y, this.size, this.size);

        // 3. Draw Locations
        const scaleX = (this.size - 20) / levelW;
        const scaleY = (this.size - 20) / levelH;
        const offsetX = x + 10;
        const offsetY = y + 10;

        // Draw points of interest
        const POIs = [];
        if (currentLevel instanceof Town) {
            POIs.push({ x: 37, y: 39, label: "Seeds", color: "#4CAF50" }); // Crop Shop
            POIs.push({ x: 33, y: 39, label: "Pets", color: "#FF9800" });  // Animal Shop
            POIs.push({ x: 29, y: 39, label: "Bar", color: "#E91E63" });   // Bar
            POIs.push({ x: 44, y: 58, label: "Recycle", color: "#2196F3" }); // Recycler
            POIs.push({ x: 45, y: 83, label: "Home", color: "#FFEB3B" });   // To Farm
        } else if (currentLevel instanceof FarmLevel) {
            POIs.push({ x: 15, y: 38, label: "House", color: "#FFEB3B" });
            POIs.push({ x: 45, y: 82, label: "Town", color: "#2196F3" });
        }

        POIs.forEach(poi => {
            const px = offsetX + poi.x * scaleX;
            const py = offsetY + poi.y * scaleY;
            
            ctx.fillStyle = poi.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = poi.color;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Label
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.font = "bold 9px Verdana";
            ctx.textAlign = "center";
            ctx.fillText(poi.label, px, py - 8);
        });

        // 4. Draw Player
        const playerX = Level.PLAYER.getMapReference().getPixelX() / Level.PLAYER.getMapReference().getTileSize();
        const playerY = Level.PLAYER.getMapReference().getPixelY() / Level.PLAYER.getMapReference().getTileSize();
        
        const ppx = offsetX + playerX * scaleX;
        const ppy = offsetY + playerY * scaleY;

        const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
        ctx.fillStyle = "white";
        ctx.shadowBlur = 10 * pulse;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(ppx, ppy, 5 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        
        // Legend Text
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "bold 12px Verdana";
        ctx.textAlign = "left";
        ctx.fillText(currentLevel.constructor.name === "Town" ? "Town Map" : "Farm Map", x, y - 10);
        ctx.restore();
    }
}
