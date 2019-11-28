import { Board } from '../models/board';

export function crownKings(boardState: Board) {
    const cellStates = boardState.cellStates;
    cellStates[0].forEach(cell => {
        if (cell.player === 1 && cell.value === 1) {
            cell.value = 2;
        }
    });
    cellStates[7].forEach(cell => {
        if (cell.player === 2 && cell.value === 1) {
            cell.value = 2;
        }
    });
}
