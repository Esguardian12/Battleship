export const domController = (() => {
    const playerBoardDiv = document.getElementById('player-board');
    const computerBoardDiv = document.getElementById('computer-board');
    const messageArea = document.getElementById('message-area');

    const renderBoard = (gameboard, container, isEnemy, onCellClick) => {
        container.innerHTML = ''; // Clear previous render

        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                const hasShip = gameboard.board[y][x] !== null;
                const isAttacked = gameboard.attackedCoords.has(`${x},${y}`);

                // Only show ships on the player's board
                if(!isEnemy && hasShip) {
                    cell.classList.add('ship'); // Fixed 'call' typo
                }

                // Handle hits and misses
                if(isAttacked) {
                    if(hasShip) {
                        cell.classList.add('hit'); // Changed from 'ship' to 'hit'
                    } else {
                        cell.classList.add('miss');
                    }
                }

                // Attach click listener for enemy board
                if (isEnemy && onCellClick) { // Fixed variable names
                    cell.addEventListener('click', () => {
                        // Only allow clicking if the cell hasn't been attacked yet
                        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
                            onCellClick(x, y); 
                        }
                    });
                }
                
                // CRITICAL: Actually add the cell to the DOM!
                container.appendChild(cell);
            }
        }
    };

    const updateMessage = (text) => {
        messageArea.textContent = text;
    };

    return { renderBoard, updateMessage, playerBoardDiv, computerBoardDiv };
})();