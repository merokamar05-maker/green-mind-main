// 1. القراءة من الـ HTML (بياخد البيانات من الـ script اللي هنحطه في الـ HTML)
const CURRENT_LEVEL = (typeof CURRENT_LEVEL_NUMBER !== 'undefined') ? CURRENT_LEVEL_NUMBER : 1;
const IMAGE_TO_LOAD = (typeof LEVEL_IMAGE !== 'undefined') ? LEVEL_IMAGE : "boy.jpg";

// 2. ربط العناصر (نفس الـ IDs اللي في الـ HTML بتاعك)
const game = document.getElementById("game");
const slots = document.getElementById("slots");
const fullImageContainer = document.getElementById("full-image-container");
const fullImage = document.getElementById("full-image");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restart-btn");
const hintBtn = document.getElementById("hint-btn");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const playAgainBtn = document.getElementById("play-again-btn"); // زرار Play Again اللي جوه الـ Pop-up

// Audio
const flipSound = document.getElementById("flip-sound");
const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");
const completeSound = document.getElementById("complete-sound");

let tiles = [], imageSlices = [], currentFlipped = null, isLocked = false;
let originalImageSrc = null, score = 0, seconds = 0, timerInterval = null;
let moves = 0, hintsRemaining = 3, completedSlots = 0;
const GRID_SIZE = 5;

// --- الدوال الأساسية ---
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
    }
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function updateTimerDisplay() {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}
function updateMovesDisplay() { movesDisplay.textContent = moves; }
function updateScoreDisplay() { scoreDisplay.textContent = score; }

function initializeSlots() {
    slots.innerHTML = "";
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.index = i;
        slot.innerHTML = `<div class="number">${i + 1}</div>`;
        slots.appendChild(slot);
    }
}

function setupGame(img) {
    stopTimer();
    score = 0; moves = 0; hintsRemaining = 3; completedSlots = 0; seconds = 0;
    updateScoreDisplay(); updateMovesDisplay(); updateTimerDisplay();
    hintBtn.textContent = `Hint (3)`; hintBtn.disabled = true;

    const size = Math.min(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
    
    originalImageSrc = canvas.toDataURL();
    fullImage.src = originalImageSrc;
    
    const pieceSize = Math.floor(size / GRID_SIZE);
    imageSlices = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = pieceSize; tempCanvas.height = pieceSize;
            tempCanvas.getContext("2d").drawImage(canvas, x * pieceSize, y * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
            imageSlices.push(tempCanvas.toDataURL());
        }
    }
    initializeSlots();
    startGame(imageSlices);
    showFullImage(10000);
}

function showFullImage(duration) {
    fullImageContainer.classList.add("visible");
    setTimeout(() => { fullImageContainer.classList.remove("visible"); startTimer(); }, duration);
}

function startGame(images) {
    game.innerHTML = "";
    const shuffled = [...Array(images.length).keys()].sort(() => Math.random() - 0.5);
    shuffled.forEach((pieceIndex, i) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.correctIndex = pieceIndex;
        tile.innerHTML = `<div class="inner"><div class="front">${i + 1}</div><div class="back"><img src="${images[pieceIndex]}"></div></div>`;
        tile.addEventListener("click", () => handleTileClick(tile));
        game.appendChild(tile);
    });
}

function handleTileClick(tile) {
    if (tile.classList.contains("flipped") || isLocked || tile.dataset.locked === "true" || currentFlipped) return;
    
    if(flipSound) flipSound.play();
    tile.classList.add("flipped");
    currentFlipped = tile;
    isLocked = true;
    hintBtn.disabled = false; // تفعيل التلميح لما يختار بلاطة

    const correctIndex = parseInt(tile.dataset.correctIndex);
    const slotHandler = (e) => {
        const slotIndex = parseInt(e.currentTarget.dataset.index);
        moves++; updateMovesDisplay();
        
        if (slotIndex === correctIndex) {
            e.currentTarget.innerHTML = `<img src="${imageSlices[correctIndex]}">`;
            tile.dataset.locked = "true";
            tile.classList.add("placed");
            score += 10; completedSlots++;
            if(successSound) successSound.play();
            currentFlipped = null; isLocked = false; hintBtn.disabled = true;
            if (completedSlots === GRID_SIZE * GRID_SIZE) completePuzzle();
        } else {
            if(failSound) failSound.play();
            setTimeout(() => {
                tile.classList.remove("flipped");
                currentFlipped = null; isLocked = false; hintBtn.disabled = true;
                score = Math.max(0, score - 5); updateScoreDisplay();
            }, 700);
        }
        slots.querySelectorAll(".slot").forEach(s => s.removeEventListener("click", slotHandler));
    };
    slots.querySelectorAll(".slot").forEach(s => s.addEventListener("click", slotHandler));
}

// --- دالة النهاية ---
function completePuzzle() {
    stopTimer();
    localStorage.setItem(`level${CURRENT_LEVEL}Completed`, 'true');
    localStorage.setItem(`level${CURRENT_LEVEL}Score`, score);

    finalScore.textContent = score;
    finalTime.textContent = timerDisplay.textContent;
    finalMoves.textContent = moves;

    if(completeSound) completeSound.play();
    createConfetti();
    
    setTimeout(() => gameOverScreen.classList.add("visible"), 1000);
}

// دالة الزرار Next Game اللي في الـ HTML
function goToNextLevel() {
    const NEXT = CURRENT_LEVEL + 1;
    window.location.href = (NEXT <= 10) ? `puzzle${NEXT}.html` : 'map1.html';
}

// برمجة الزراير اللي في الصفحة
restartBtn.onclick = () => location.reload();
playAgainBtn.onclick = () => location.reload();

hintBtn.onclick = () => {
    if (hintsRemaining > 0 && currentFlipped) {
        const correctIdx = parseInt(currentFlipped.dataset.correctIndex);
        const slot = document.querySelector(`.slot[data-index="${correctIdx}"]`);
        slot.innerHTML = `<img src="${imageSlices[correctIdx]}">`;
        currentFlipped.dataset.locked = "true";
        currentFlipped.classList.add("placed");
        currentFlipped.classList.remove("flipped");
        completedSlots++; score += 5; hintsRemaining--;
        hintBtn.textContent = `Hint (${hintsRemaining})`;
        currentFlipped = null; isLocked = false; hintBtn.disabled = true;
        updateScoreDisplay();
        if (completedSlots === GRID_SIZE * GRID_SIZE) completePuzzle();
    }
};

window.addEventListener("load", () => {
    const img = new Image();
    img.onload = () => setupGame(img);
    img.src = IMAGE_TO_LOAD;
});

function createConfetti() {
    for(let i=0; i<50; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random()*100+'vw';
        c.style.backgroundColor = ['#ff0','#f0f','#0ff'][Math.floor(Math.random()*3)];
        document.body.appendChild(c);
        c.animate([{top:'-10px'},{top:'100vh'}], {duration: 3000});
        setTimeout(() => c.remove(), 3000);
    }
}
