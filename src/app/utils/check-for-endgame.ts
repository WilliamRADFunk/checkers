export function checkForEndGame(activePlayer: number, clickableCellIdsLength: number): number {
    if (clickableCellIdsLength) {
        return 0; // Player not only has pieces, but available moves too.
    // Player has(n't) pieces left, but none that can move.
    } else {
        return activePlayer === 2 ? 1 : 2; // Opposite of new player is winner.
    }
}
