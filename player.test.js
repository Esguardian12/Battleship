import { Player } from './player.js';

describe('Player Factory', () => {
  let player;
  let enemy;

  beforeEach(() => {
    player = Player('real');
    enemy = Player('computer');
  });

  test('Player has a Gameboard', () => {
    expect(player.gameboard).toBeDefined();
    expect(player.gameboard.board.length).toBe(10);
  });

  test('Real player can attack enemy board', () => {
    enemy.gameboard.placeShip(3, 0, 0, false);
    
    // Player attacks [0,0]
    player.attack(enemy.gameboard, 0, 0);
    
    // Enemy ship should have 1 hit
    expect(enemy.gameboard.board[0][0].hits).toBe(1);
  });

  test('Computer player attacks a valid coordinate', () => {
    player.gameboard.placeShip(3, 0, 0, false);
    
    const attackCoord = enemy.computerAttack(player.gameboard);
    const [x, y] = attackCoord;

    // Ensure the returned coordinates are within the 0-9 grid
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(10);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(10);
    
    // Ensure the attack was actually registered on the player's board
    const totalAttacks = player.gameboard.missedAttacks.length + 
                         (player.gameboard.board[y][x] ? player.gameboard.board[y][x].hits : 0);
    expect(totalAttacks).toBe(1);
  });

  test('Computer never attacks the same spot twice', () => {
    // Fire 100 shots (the entire board)
    for (let i = 0; i < 100; i++) {
      enemy.computerAttack(player.gameboard);
    }

    // The player's missed attacks array should hold exactly 100 misses 
    // (since we placed no ships on the player's board)
    expect(player.gameboard.missedAttacks.length).toBe(100);
    
    // A 101st attack should safely return null because no moves are left
    expect(enemy.computerAttack(player.gameboard)).toBeNull();
  });
});