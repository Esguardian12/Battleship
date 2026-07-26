import { Ship } from './ship.js';

export function Gameboard() {
  const size = 10;
  const board = Array.from({ length: size }, () => Array(size).fill(null));
  const ships = [];
  const missedAttacks = [];
  const attackedCoords = new Set(); 

  const isValidPlacement = (length, startX, startY, isVertical = false) => {
    if (isVertical && startY + length > size) return false;
    if (!isVertical && startX + length > size) return false;

    for (let i = 0; i < length; i++) {
      if (isVertical && board[startY + i][startX] !== null) return false;
      if (!isVertical && board[startY][startX + i] !== null) return false;
    }
    return true;
  };

  const placeShip = (length, startX, startY, isVertical = false) => {
    if (!isValidPlacement(length, startX, startY, isVertical)) {
      throw new Error('Invalid placement');
    }

    const newShip = Ship(length);
    for (let i = 0; i < length; i++) {
      if (isVertical) {
        board[startY + i][startX] = newShip;
      } else {
        board[startY][startX + i] = newShip;
      }
    }
    ships.push(newShip);
  };

  const receiveAttack = (x, y) => {
    const coordString = `${x},${y}`;
    if (attackedCoords.has(coordString)) return false; 
    
    attackedCoords.add(coordString);
    const target = board[y][x];

    if (target === null) {
      missedAttacks.push([x, y]);
      return false; 
    } else {
      target.hit();
      return true; 
    }
  };

  const allShipsSunk = () => {
    if (ships.length === 0) return false; 
    return ships.every(ship => ship.isSunk());
  };

  return {
    get board() { return board; },
    get missedAttacks() { return missedAttacks; },
    get attackedCoords() { return attackedCoords; },
    isValidPlacement,
    placeShip,
    receiveAttack,
    allShipsSunk
  };
}