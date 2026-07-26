import { Gameboard } from './gameboard.js';

export function Player(type = 'real') {
  const gameboard = Gameboard();
  
  // Create an array of all possible coordinates [0,0] to [9,9]
  const availableMoves = [];
  if (type === 'computer') {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        availableMoves.push([x, y]);
      }
    }
  }

  // Real player attack
  const attack = (enemyBoard, x, y) => {
    return enemyBoard.receiveAttack(x, y);
  };

  // Computer AI attack
  const computerAttack = (enemyBoard) => {
    if (availableMoves.length === 0) return null;

    // Pick a random index from the remaining available moves
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const [x, y] = availableMoves[randomIndex];

    // Remove that move so it can never be picked again
    availableMoves.splice(randomIndex, 1);

    // Execute the attack on the enemy's board
    enemyBoard.receiveAttack(x, y);
    
    // Return the coordinates so our UI knows where the computer shot
    return [x, y]; 
  };

  return {
    type,
    get gameboard() { return gameboard; },
    attack,
    computerAttack
  };
}