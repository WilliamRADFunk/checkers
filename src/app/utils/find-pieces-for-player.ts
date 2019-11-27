import { Board } from '../models/board';
import { Cell } from '../models/cell';

export function findPiecesForPlayer(activePlayer: number, boardState: Board): Cell[] {
    const cellStates = boardState.cellStates;
    const playerPieces = [];
    cellStates.forEach(row => {
        row.forEach(cell => {
            if (cell.player === activePlayer) {
                playerPieces.push(cell);
            }
        });
    });
    return playerPieces;
}
