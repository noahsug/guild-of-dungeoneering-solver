export default class Node {
  static Type = {
    // Starting node, acts as entry point only.
    ROOT: 0,
    // Has a random chance of being selected.
    CHANCE: 1,
    // Selected by player.
    PLAYER: 2,
  }
}
