import { Ship } from './ship.js';

test('Ship takes a hit', () => {
  const myShip = Ship(3);
  myShip.hit();
  expect(myShip.hits).toBe(1);
});

test('Ship sinks when hits equal length', () => {
  const myShip = Ship(2);
  myShip.hit();
  myShip.hit();
  expect(myShip.isSunk()).toBe(true);
});