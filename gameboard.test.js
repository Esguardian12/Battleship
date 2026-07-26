import { Gameboard } from './gameboard.js';

describe('Gameboard Factory', () => {
  let board;

  // Re-initialize a fresh board before every test
  beforeEach(() => {
    board = Gameboard();
  });

  test('Places a ship horizontally', () => {
    board.placeShip(3, 0, 0, false);
    expect(board.board[0][0]).not.toBeNull();
    expect(board.board[0][1]).not.toBeNull();
    expect(board.board[0][2]).not.toBeNull();
    expect(board.board[0][3]).toBeNull(); // Empty water
  });

  test('Places a ship vertically', () => {
    board.placeShip(2, 2, 2, true);
    expect(board.board[2][2]).not.toBeNull();
    expect(board.board[3][2]).not.toBeNull();
    expect(board.board[4][2]).toBeNull();
  });

  test('receiveAttack hits a ship', () => {
    board.placeShip(3, 0, 0, false);
    board.receiveAttack(1, 0); // Hit the middle of the ship
    
    // The ship at board[0][0] is the exact same object reference as board[0][1]
    expect(board.board[0][0].hits).toBe(1); 
  });

  test('receiveAttack records a miss', () => {
    board.placeShip(2, 0, 0, false);
    board.receiveAttack(5, 5); // Miss
    
    expect(board.missedAttacks.length).toBe(1);
    expect(board.missedAttacks[0]).toEqual([5, 5]);
  });

  test('allShipsSunk correctly reports game over', () => {
    board.placeShip(2, 0, 0, false);
    board.placeShip(1, 0, 1, false);

    board.receiveAttack(0, 0);
    board.receiveAttack(1, 0);
    expect(board.allShipsSunk()).toBe(false); // First ship sunk, second remains

    board.receiveAttack(0, 1);
    expect(board.allShipsSunk()).toBe(true); // Both sunk
  });

  test('Prevents attacking the same coordinate twice', () => {
    board.receiveAttack(2, 2);
    board.receiveAttack(2, 2);
    expect(board.missedAttacks.length).toBe(1);
  });
});