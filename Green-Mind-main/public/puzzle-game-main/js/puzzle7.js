const upload = document.getElementById("upload");
const uploadLabel = document.getElementById("upload-label");
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
const playAgainBtn = document.getElementById("play-again-btn");
const CURRENT_LEVEL_NUMBER = 7; 

//Audio 
const flipSound = document.getElementById("flip-sound");
const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");
const completeSound = document.getElementById("complete-sound");

//Game state
let tiles = [];
let imageSlices = [];
let currentFlipped = null;
let isLocked = false;
let originalImageSrc = null;
let score = 0;
let seconds = 0;
let timerInterval = null;
let moves = 0;
let hintsRemaining = localStorage.getItem('globalHints') ? parseInt(localStorage.getItem('globalHints')) : 3;
let completedSlots = 0;
const GRID_SIZE = 5;

//Initialize slots
function initializeSlots() {
  slots.innerHTML = "";
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = i;
    const number = document.createElement("div");
    number.className = "number";
    number.textContent = i + 1;
    slot.appendChild(number);
    slots.appendChild(slot);
  }
}

//Timer
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }
}
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function updateTimerDisplay() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

//UI updates
function updateMovesDisplay() { movesDisplay.textContent = moves; }
function updateScoreDisplay() { scoreDisplay.textContent = score; }
function updateHintButton() {
  hintBtn.textContent = `Hint (${hintsRemaining})`;
  hintBtn.disabled = hintsRemaining <= 0 || !currentFlipped;
}

//Reset game 
function resetGame() {
  stopTimer();
  score = 0; moves = 0; hintsRemaining = localStorage.getItem('globalHints') ? parseInt(localStorage.getItem('globalHints')) : 3; completedSlots = 0;
  currentFlipped = null; isLocked = false; seconds = 0;
  updateScoreDisplay(); updateMovesDisplay(); updateHintButton(); updateTimerDisplay();
  game.innerHTML = "";
  initializeSlots();
  tiles = []; imageSlices = [];
}

//Setup game from image
function setupGame(img) {
  resetGame();
  
  // OPTIMIZATION: Limit the internal processing size to 800px max
  const MAX_INTERNAL_SIZE = 800;
  const sourceSize = Math.min(img.width, img.height);
  const internalSize = Math.min(sourceSize, MAX_INTERNAL_SIZE);
  
  const sx = Math.floor((img.width - sourceSize) / 2);
  const sy = Math.floor((img.height - sourceSize) / 2);
  
  const canvas = document.createElement("canvas");
  canvas.width = internalSize; 
  canvas.height = internalSize;
  
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, internalSize, internalSize);
  
  fullImage.src = canvas.toDataURL("image/jpeg", 0.8);
  originalImageSrc = fullImage.src;
  
  const pieceSize = Math.floor(internalSize / GRID_SIZE);
  imageSlices = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = pieceSize; 
      tempCanvas.height = pieceSize;
      const tCtx = tempCanvas.getContext("2d");
      tCtx.drawImage(canvas, x * pieceSize, y * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
      imageSlices.push(tempCanvas.toDataURL("image/jpeg", 0.8));
    }
  }
  
  startGame(imageSlices);
  showFullImage(10000);
  
  // Processing done
  hideLoading();
}

//Show full image preview
function showFullImage(duration=1000) {
  fullImageContainer.classList.add("visible");
  fullImage.src = originalImageSrc;
  setTimeout(() => {
    fullImageContainer.classList.remove("visible");
    startTimer();
  }, duration);
}

//Start game
function startGame(images) {
  tiles = [];
  const originalOrder = [...Array(GRID_SIZE*GRID_SIZE).keys()];
  const shuffledPositions = [...originalOrder].sort(()=>Math.random()-0.5);
  game.innerHTML = "";
  slots.querySelectorAll(".slot").forEach(s => s.innerHTML=`<div class="number">${parseInt(s.dataset.index)+1}</div>`);
  for (let i=0; i<GRID_SIZE*GRID_SIZE; i++) {
    const pieceIndex = shuffledPositions[i];
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.correctIndex = pieceIndex;
    tile.dataset.locked = "false";
    const inner = document.createElement("div"); inner.className="inner";
    const front = document.createElement("div"); front.className="front"; front.textContent=i+1;
    const back = document.createElement("div"); back.className="back";
    const img = document.createElement("img"); img.src = images[pieceIndex];
    back.appendChild(img);
    inner.appendChild(front); inner.appendChild(back);
    tile.appendChild(inner);
    game.appendChild(tile);
    // Staggered entrance delay
    tile.style.animationDelay = `${i * 0.05}s`;
    tile.addEventListener("click", ()=>handleTileClick(tile));
    tiles.push(tile);
  }
  updateHintButton();
}

//Handle tile click
function handleTileClick(tile) {
  if (tile.classList.contains("flipped") || isLocked || tile.dataset.locked==="true" || currentFlipped) return;
  if(flipSound){ try{flipSound.currentTime=0;flipSound.play();}catch(e){} }
  tile.classList.add("flipped");
  currentFlipped = tile;
  isLocked = true;
  const correctIndex = parseInt(tile.dataset.correctIndex);
  const slotClick = (e)=>{
    const slotIndex = parseInt(e.currentTarget.dataset.index);
    moves++; updateMovesDisplay();
    if(slotIndex === correctIndex){
      const imgNode = currentFlipped.querySelector(".back img").cloneNode();
      const slot = slots.querySelector(`.slot[data-index='${slotIndex}']`);
      slot.innerHTML=""; slot.appendChild(imgNode);
      // Feedback animation
      slot.classList.add("correct-match");
      setTimeout(()=>slot.classList.remove("correct-match"), 800);
      
      currentFlipped.dataset.locked="true";
      currentFlipped.classList.add("placed");
      currentFlipped = null;
      isLocked=false;
      score+=10; updateScoreDisplay();
      completedSlots++;
      if(successSound){ try{successSound.currentTime=0;successSound.play();}catch(e){} }
      if(completedSlots===GRID_SIZE*GRID_SIZE) completePuzzle();
    } else {
      if(failSound){ try{failSound.currentTime=0;failSound.play();}catch(e){} }
      document.querySelectorAll(".tile,.slot").forEach(el=>{el.style.animation="shake 0.5s"; setTimeout(()=>el.style.animation="",500); });
      setTimeout(()=>{
        tile.classList.remove("flipped");
        currentFlipped.dataset.locked="false";
        currentFlipped=null;
        isLocked=false;
        score=Math.max(0,score-5); updateScoreDisplay();
      },700);
    }
    slots.querySelectorAll(".slot").forEach(s=>s.removeEventListener("click",slotClick));
    updateHintButton();
  };
  slots.querySelectorAll(".slot").forEach(s=>s.addEventListener("click",slotClick));
  updateHintButton();
}

//Complete puzzle
function completePuzzle() {
  stopTimer();
  localStorage.setItem(`level${CURRENT_LEVEL_NUMBER}Completed`, 'true');
  localStorage.setItem(`level${CURRENT_LEVEL_NUMBER}Score`, score);

  if(completeSound){ try{completeSound.currentTime=0;completeSound.play(); } catch(e){} }
  createConfetti();
  
  setTimeout(() => {
    gameOverScreen.classList.add("visible");
    displayVictoryStats();
    if(typeof playAgainBtn !== 'undefined' && playAgainBtn) {
        playAgainBtn.onclick = () => { window.location.href = 'map1.html'; };
    }
  }, 1000);
}

function displayVictoryStats() {
    const finalScoreEl = document.getElementById("final-score");
    const finalTimeEl = document.getElementById("final-time");
    const finalMovesEl = document.getElementById("final-moves");
    const banner = document.getElementById("victory-banner");

    // Star calculation (Level 7: 5x5 = 25 slots)
    const N = GRID_SIZE * GRID_SIZE;
    let starCount = 1;
    if (moves <= N) starCount = 3;
    else if (moves <= N * 1.5) starCount = 2;

    // Save stars for Map UI
    localStorage.setItem(`level${CURRENT_LEVEL_NUMBER}Stars`, starCount);

    // Money Reward calculation
    const rewards = { 3: 100, 2: 75, 1: 50 };
    const rewardAmount = rewards[starCount] || 50;
    
    // Update total money
    let totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
    totalMoney += rewardAmount;
    localStorage.setItem('totalMoney', totalMoney);

    const bannerMessages = ["Good Job!", "Well Done!", "Amazing!", "Perfect!"];
    banner.textContent = bannerMessages[starCount];

    // Animate stats
    animateValue(finalScoreEl, 0, score, 1500);
    animateValue(finalMovesEl, 0, moves, 1500);
    animateValue(document.getElementById("reward-amount"), 0, rewardAmount, 1500);
    finalTimeEl.textContent = timerDisplay.textContent;

    // Update live money display if it exists
    const liveMoney = document.getElementById("money-display");
    if (liveMoney) {
        liveMoney.innerHTML = `<i class="fas fa-coins coin-icon"></i> ${totalMoney}`;
    }

    // Show stars one by one
    for (let i = 1; i <= 3; i++) {
        const star = document.getElementById(`star-${i}`);
        setTimeout(() => {
            if (i <= starCount) {
                star.classList.add("filled", "star-pop");
            }
        }, 500 + (i * 300));
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


function goToNextLevel() {
    const NEXT_LEVEL = CURRENT_LEVEL_NUMBER + 1;
    
    if (NEXT_LEVEL <= 10) {
        window.location.href = `puzzle${NEXT_LEVEL}.html`;
    } else {
        window.location.href = 'map1.html'; 
    }
}

//Confetti
function createConfetti() {
  const colors=['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];
  for(let i=0;i<100;i++){
    const confetti=document.createElement("div");
    confetti.className="confetti";
    confetti.style.left=Math.random()*100+'vw';
    confetti.style.top='-10px';
    confetti.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];
    confetti.style.transform=`rotate(${Math.random()*360}deg)`;
    document.body.appendChild(confetti);
    const duration=Math.random()*3+2;
    confetti.animate([{top:'-10px',opacity:1},{top:'100vh',opacity:0}],{duration:duration*1000,easing:'cubic-bezier(0.1,0.8,0.9,1)'});
    setTimeout(()=>confetti.remove(),duration*1000);
  }
}

//Shake keyframes
const style=document.createElement("style");
style.textContent=`@keyframes shake {0%,100%{transform:translateX(0);}10%,30%,50%,70%,90%{transform:translateX(-5px);}20%,40%,60%,80%{transform:translateX(5px);}}`;
document.head.appendChild(style);

//Buttons
restartBtn.addEventListener("click",()=>{
  if(originalImageSrc){
    const img=new Image();
    img.onload=()=>setupGame(img);
    img.src=originalImageSrc;
    gameOverScreen.classList.remove("visible");
  }
});

//Hint button
hintBtn.addEventListener("click", () => {
  if (hintsRemaining > 0 && currentFlipped) {
    const tile = currentFlipped;
    const correctIndex = parseInt(tile.dataset.correctIndex);
    const slot = document.querySelector(`.slot[data-index="${correctIndex}"]`);
    if (!slot) return;
    slot.innerHTML = "";
    const imgNode = tile.querySelector(".back img").cloneNode();
    slot.appendChild(imgNode);
    tile.dataset.locked = "true";
    tile.classList.add("placed");
    currentFlipped = null;
    isLocked = false;
    const inner = tile.querySelector(".inner");
    if (inner) {
      inner.style.transform = "none";
      inner.style.transition = "none";
    }
    tile.classList.remove("flipped");
    completedSlots++;
    score += 5;
    updateScoreDisplay();
    hintsRemaining--;
    localStorage.setItem('globalHints', hintsRemaining);
    updateHintButton();
    if (successSound) { 
      try { successSound.currentTime = 0; successSound.play(); } catch(e) {} 
    }
    if (completedSlots === GRID_SIZE * GRID_SIZE) completePuzzle();
  }
});
function updateScoreDisplay() { 
    scoreDisplay.textContent = score; 
    localStorage.setItem(`level${CURRENT_LEVEL_NUMBER}Score`, score); 
}

//Auto-load built-in image
window.addEventListener("load", () => {
  showLoading();
  const img = new Image();
  img.onload = () => {
    setupGame(img);
  };
  img.src = "assets/images/bee.jpg"; 

  // Show current money on load
  const totalMoney = localStorage.getItem('totalMoney') || 0;
  const liveMoney = document.getElementById("money-display");
  if (liveMoney) {
      liveMoney.innerHTML = `<i class="fas fa-coins coin-icon"></i> ${totalMoney}`;
  }
});
