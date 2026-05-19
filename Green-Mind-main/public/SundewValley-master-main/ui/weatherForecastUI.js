class WeatherForecastUI {
    constructor() {
        this.isOpening = true;
        this.cooldown = 10; // Frames before it can be closed
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        // If mouse is clicked or Escape is pressed, close the UI
        if ((Controller.mouse.leftClick && !Controller.mouse_prev.leftClick) || Controller.keys["Escape"]) {
            this.isOpening = false;
            Controller.mouse.leftClick = false; // Consume click
            Controller.keys["Escape"] = false;
        }
    }

    draw(ctx) {
        const padding = 40;
        const width = ctx.canvas.height * 0.8; // Square-ish based on height
        const height = width;
        const x = (ctx.canvas.width - width) / 2;
        const y = (ctx.canvas.height - height) / 2;

        ctx.save();

        // 1. Dim Background
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 2. Draw Frame / Border (Glassmorphism look)
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 8;
        
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x - 10, y - 10, width + 20, height + 20, 20);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.strokeRect(x - 10, y - 10, width + 20, height + 20);
        }

        // 3. Draw the Weather Report Image
        const img = ASSET_MANAGER.getImage("ui", "weather_report.png");
        if (img) {
            ctx.drawImage(img, x, y, width, height);
        } else {
            // Fallback if image not found
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Loading Weather Report...", ctx.canvas.width / 2, ctx.canvas.height / 2);
        }

        // 4. Instruction text
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 18px Verdana";
        ctx.textAlign = "center";
        ctx.fillText("Click anywhere to close", ctx.canvas.width / 2, y + height + 40);

        ctx.restore();
    }
}
