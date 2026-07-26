export function Ship(length) {
  let hits = 0;

  return {
    get length() { return length; },
    get hits() { return hits; },
    hit() {
      if (hits < length) hits++;
    },
    isSunk() {
      return hits >= length;
    }
  };
}