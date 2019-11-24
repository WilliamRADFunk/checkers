import { Board } from '../models/board';

export function crownKings(activePlayer: number, boardState: Board) {
    const cellStates = boardState.cellStates;
    if (activePlayer === 1) {
        cellStates[0].forEach(cell => {
            if (cell.player === 1 && cell.value === 1) {
                cell.value = 2;
            }
        });
    } else {
        cellStates[7].forEach(cell => {
            if (cell.player === 2 && cell.value === 1) {
                cell.value = 2;
            }
        });
    }
}