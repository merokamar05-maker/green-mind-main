class MessageBox {
    static draw(ctx, content, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2) {
        fontSize = Math.floor(fontSize)
        paddingX = Math.floor(paddingX)
        paddingY = Math.floor(paddingY)
        Font.update(ctx, fontSize)
        const _measurement = Font.measure(ctx, content)
        
        const dw = Math.floor(_measurement.width) + paddingX * 2
        const dh = fontSize + paddingY * 2
        
        ctx.save();
        // Creamy Amber MessageBox (No Shadows)
        const bgGradient = ctx.createLinearGradient(dx, dy, dx, dy + dh);
        bgGradient.addColorStop(0, "rgba(255, 250, 220, 0.96)");
        bgGradient.addColorStop(1, "rgba(255, 230, 160, 0.96)");
        ctx.fillStyle = bgGradient;
        
        ctx.shadowBlur = 0; 
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(dx, dy, dw, dh, 14);
        else ctx.rect(dx, dy, dw, dh);
        ctx.fill();
        
        // Soft Amber Border
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 180, 0, 0.45)";
        ctx.stroke();
        
        // High-contrast Navy/Chocolate text
        Font.draw(ctx, content, fontSize, dx + paddingX, Math.floor(dy + paddingY + fontSize * 0.75), "#2c1810", "rgba(255,255,255,0.2)", "Segoe UI", "bold", false)
        ctx.restore();
    }

    static drawLines(ctx, contents, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2, offsetXBaseOnWidth = 0, offsetYBaseOnHeight = 0) {
        fontSize = Math.floor(fontSize)
        Font.update(ctx, fontSize)
        paddingX = 20
        paddingY = 15
        
        let max_width = 0
        contents.forEach(_content => {
            const _m = ctx.measureText(_content)
            if (_m.width > max_width) max_width = _m.width
        })
        
        const rectWidth = max_width + paddingX * 4
        const rectHeight = contents.length * (fontSize + paddingY / 2) + paddingY * 1.5
        
        const rectX = dx - rectWidth * offsetXBaseOnWidth
        const rectY = dy - rectHeight * offsetYBaseOnHeight
        
        ctx.save();
        ctx.shadowBlur = 0; // Removed shadows
        // Cheerful Orange background
        const bgGradient = ctx.createLinearGradient(rectX, rectY, rectX, rectY + rectHeight);
        bgGradient.addColorStop(0, "rgba(255, 245, 200, 0.98)");
        bgGradient.addColorStop(1, "rgba(255, 210, 100, 0.98)");
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 18);
        else ctx.rect(rectX, rectY, rectWidth, rectHeight);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 160, 0, 0.5)";
        ctx.stroke();
        ctx.restore();

        for (let i = 0; i < contents.length; i++) {
            Font.draw(ctx, contents[i], fontSize, rectX + paddingX * 2, Math.floor(rectY + paddingY + (fontSize + paddingY / 2) * i + fontSize * 0.75), "#3e2723", "rgba(255,255,255,0.5)", "Segoe UI", "bold", false)
        }
    }
}

class MessageButton {
    static draw(ctx, content, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2, isVibrant = false) {
        fontSize = Math.floor(fontSize);
        paddingX = Math.floor(paddingX);
        paddingY = Math.floor(paddingY);
        
        // Premium typography for vibrant buttons
        const fontStack = isVibrant ? "'Outfit', 'Inter', 'Segoe UI', sans-serif" : "'Segoe UI', sans-serif";
        ctx.font = `bold ${fontSize}px ${fontStack}`;
        
        const _measurement = ctx.measureText(content);
        const dw = Math.floor(_measurement.width) + paddingX * 2;
        const dh = fontSize + paddingY * 2;
        const isHovered = dx < Controller.mouse.x && Controller.mouse.x < dx + dw && dy < Controller.mouse.y && Controller.mouse.y < dy + dh;
        
        const time = Date.now() / 400;
        const pulse = Math.abs(Math.sin(time)) * 0.5 + 0.3;
        const scale = isVibrant ? (isHovered ? 1.06 : 1 + Math.sin(time) * 0.02) : 1;
        
        ctx.save();
        
        if (isVibrant) {
            ctx.translate(dx + dw / 2, dy + dh / 2);
            ctx.scale(scale, scale);
            ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
        }

        // 1. No Shadows for cleaner look
        ctx.shadowBlur = 0;

        // 2. Main Frame (Vibrant Gradient for a "Happy" feel)
        const bgGradient = ctx.createRadialGradient(dx + dw / 2, dy + dh / 2, 0, dx + dw / 2, dy + dh / 2, dw / 1.5);
        if (isHovered) {
            bgGradient.addColorStop(0, "rgba(255, 170, 50, 0.98)");
            bgGradient.addColorStop(1, "rgba(255, 120, 0, 0.98)");
        } else {
            bgGradient.addColorStop(0, "rgba(255, 230, 100, 0.95)");
            bgGradient.addColorStop(1, "rgba(255, 190, 30, 0.95)");
        }
        ctx.fillStyle = bgGradient;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(dx, dy, dw, dh, 12);
        else ctx.rect(dx, dy, dw, dh);
        ctx.fill();

        // 3. (Glossy Shine Overlay Removed for cleaner look)

        // 4. Borders
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isHovered ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.15)";
        ctx.stroke();
        
        if (isVibrant && !isHovered) {
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "rgba(218, 165, 32, 0.4)";
            ctx.stroke();
        }

        // 5. Stylized Text with Gold Gradient
        const textX = dx + paddingX;
        const textY = Math.floor(dy + paddingY + fontSize * 0.82);
        
        if (isVibrant) {
            const textGradient = ctx.createLinearGradient(textX, textY - fontSize, textX, textY);
            textGradient.addColorStop(0, "#fff59d"); // Light gold
            textGradient.addColorStop(0.5, "#ffb300"); // Mid gold
            textGradient.addColorStop(1, "#f57f17"); // Deep gold
            
            ctx.fillStyle = textGradient;
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = isHovered ? "#ffffff" : "#2c1810";
        }
        
        ctx.fillText(content, textX, textY);
        
        // Subtle outline for vibrance
        if (isVibrant) {
            ctx.strokeStyle = "rgba(0,0,0,0.3)";
            ctx.lineWidth = 0.5;
            ctx.strokeText(content, textX, textY);
        }

        ctx.restore();
        return isHovered;
    }
}