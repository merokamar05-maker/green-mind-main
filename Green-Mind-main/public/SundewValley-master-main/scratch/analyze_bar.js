const fs = require('fs');
const data = JSON.parse(fs.readFileSync('levels/bar.json', 'utf8'));

let minX = Infinity, minY = Infinity;
data.layers.forEach(l => {
    if (l.chunks) l.chunks.forEach(c => {
        minX = Math.min(minX, c.x);
        minY = Math.min(minY, c.y);
    });
});

console.log(`Global MinX: ${minX}, MinY: ${minY}`);

data.layers.forEach(l => {
    if (l.name === "Wall and Floor" && l.chunks) {
        l.chunks.forEach(c => {
            for (let i = 0; i < c.data.length; i++) {
                if (c.data[i] !== 0) {
                    const localX = i % c.width;
                    const localY = Math.floor(i / c.width);
                    const worldX = c.x + localX;
                    const worldY = c.y + localY;
                    const normX = worldX - minX;
                    const normY = worldY - minY;
                    // Log only a few to get the sense of bounds
                    if (normX % 5 === 0 && normY % 5 === 0) {
                        console.log(`Occupied: Norm(${normX}, ${normY}) [World(${worldX}, ${worldY})] ID: ${c.data[i]}`);
                    }
                }
            }
        });
    }
});
