const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error('Not a PNG file');
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
}

const filePath = 'c:/Users/kamar/Desktop/SundewValley-master/SundewValley-master/images/characters/grandmother.png';
try {
    const dimensions = getPngDimensions(filePath);
    console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`);
} catch (err) {
    console.error(err);
}
