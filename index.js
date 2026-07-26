import { Player } from './player.js';
import { domController } from './domController.js';

let player = Player('real');
let computer = Player('computer');
let gameOver = false;

// --- SETUP PHASE ---
let isVertical = false;
let currentShipIndex = 0;
const shipsToPlace = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 }
];

const setupPanel = document.getElementById('setup-panel');
const rotateBtn = document.getElementById('rotate-btn');
const setupInstruction = document.getElementById('setup-instruction');

rotateBtn.addEventListener('click', () => {
  isVertical = !isVertical;
  rotateBtn.textContent = `Orientation: ${isVertical ? 'Vertical' : 'Horizontal'}`;
});

// Attach delegated event listeners to the board ONCE
function bindSetupListeners() {
  domController.playerBoardDiv.addEventListener('mouseover', (e) => {
    if (currentShipIndex >= shipsToPlace.length) return; // Stop if setup is done
    const cell = e.target.closest('.cell');
    if (!cell) return;
    
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    handleHover(x, y, shipsToPlace[currentShipIndex].length);
  });

  domController.playerBoardDiv.addEventListener('mouseout', (e) => {
    if (currentShipIndex >= shipsToPlace.length) return;
    if (e.target.closest('.cell')) {
      clearHovers();
    }
  });

  domController.playerBoardDiv.addEventListener('click', (e) => {
    if (currentShipIndex >= shipsToPlace.length) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    handlePlacementClick(x, y, shipsToPlace[currentShipIndex].length);
  });
}

function initSetupPhase() {
  domController.computerBoardDiv.style.display = 'none';
  bindSetupListeners(); // Initialize listeners once
  renderPlacementBoard();
}

function renderPlacementBoard() {
  domController.renderBoard(player.gameboard, domController.playerBoardDiv, false, null);
  
  const currentShip = shipsToPlace[currentShipIndex];
  setupInstruction.textContent = `Place your ${currentShip.name} (Length: ${currentShip.length})`;
  
  // NOTE: We no longer run a loop here to attach event listeners. 
  // Our delegated listeners in bindSetupListeners() handle it seamlessly!
}

function handleHover(startX, startY, length) {
  clearHovers();
  const isValid = player.gameboard.isValidPlacement(length, startX, startY, isVertical);
  
  for (let i = 0; i < length; i++) {
    let targetX = isVertical ? startX : startX + i;
    let targetY = isVertical ? startY + i : startY;

    if (targetX < 10 && targetY < 10) {
      const cell = domController.playerBoardDiv.querySelector(`[data-x="${targetX}"][data-y="${targetY}"]`);
      if (cell) {
        cell.classList.add(isValid ? 'valid-preview' : 'invalid-preview');
      }
    }
  }
}

function clearHovers() {
  const cells = domController.playerBoardDiv.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('valid-preview', 'invalid-preview');
  });
}

function handlePlacementClick(x, y, length) {
  if (player.gameboard.isValidPlacement(length, x, y, isVertical)) {
    player.gameboard.placeShip(length, x, y, isVertical);
    currentShipIndex++;

    if (currentShipIndex < shipsToPlace.length) {
      renderPlacementBoard(); 
    } else {
      clearHovers(); // Clean up remaining hover shadows before starting
      startGamePhase();
    }
  }
}

// --- GAME PHASE ---

function startGamePhase() {
  setupPanel.style.display = 'none';
  domController.computerBoardDiv.style.display = 'grid'; // un-hide enemy board
  
  placeComputerShips();

  domController.updateMessage("All ships in position. Attack the enemy grid!");
  updateScreen();
}

function placeComputerShips() {
  shipsToPlace.forEach(ship => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 1000) {
      attempts++;
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);
      const randomVertical = Math.random() > 0.5;

      if (computer.gameboard.isValidPlacement(ship.length, randomX, randomY, randomVertical)) {
        computer.gameboard.placeShip(ship.length, randomX, randomY, randomVertical);
        placed = true;
      }
    }
    if (!placed) {
      console.warn(`Could not place ${ship.name} randomly, forcing linear placement.`);
      for (let y = 0; y < 10; y++) {
        if (placed) break;
        for (let x = 0; x < 10; x++) {
          if (computer.gameboard.isValidPlacement(ship.length, x, y, false)) {
            computer.gameboard.placeShip(ship.length, x, y, false);
            placed = true;
            break;
          }
        }
      }
    }
  });
}

function handlePlayerAttack(x, y) {
  if (gameOver) return;

  // 1. Player attacks
  player.attack(computer.gameboard, x, y);
  
  if (computer.gameboard.allShipsSunk()) {
    gameOver = true;
    updateScreen();
    domController.updateMessage("You Win! All enemy ships destroyed.");
    return;
  }

  // 2. Computer retaliates
  computer.computerAttack(player.gameboard);

  if (player.gameboard.allShipsSunk()) {
    gameOver = true;
    updateScreen();
    domController.updateMessage("Game Over! The computer destroyed your fleet.");
    return;
  }

  // 3. Re-render
  updateScreen();
}

function updateScreen() {
  domController.renderBoard(player.gameboard, domController.playerBoardDiv, false, null);
  domController.renderBoard(computer.gameboard, domController.computerBoardDiv, true, handlePlayerAttack);
}

// Start the app in setup mode
initSetupPhase();