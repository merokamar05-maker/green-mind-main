const fs = require('fs');
const data = JSON.parse(fs.readFileSync('levels/bar.json', 'utf8'));

console.log(`Layer count: ${data.layers.length}`);
data.layers.forEach(l => {
    console.log(`Layer: ${l.name}, Type: ${l.type}, hasChunks: ${!!l.chunks}`);
    if (l.chunks) {
        console.log(`  Chunk Count: ${l.chunks.length}`);
        l.chunks.forEach(c => {
            console.log(`  Chunk at ${c.x}, ${c.y}`);
        });
    }
});
