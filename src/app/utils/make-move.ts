import { Board } from '../models/board';

export function makeMove(boardState: Board, row1: number, col1: number, row2: number, col2: number, cellToEliminate: number[]): void {
    const cellStates = boardState.cellStates;
    if (cellToEliminate.length) {
        const cellState = cellStates[cellToEliminate[0]][cellToEliminate[1]];
        cellState.player = 0;
        cellState.value = 0;
        cellState.playerColor = '';
    }
    const cellStateBefore = cellStates[row1][col1];
    const cellStateAfter = cellStates[row2][col2];

    cellStateAfter.player = cellStateBefore.player;
    cellStateAfter.value = cellStateBefore.value;
    cellStateAfter.playerColor = cellStateBefore.playerColor;

    cellStateBefore.player = 0;
    cellStateBefore.value = 0;
    cellStateBefore.playerColor = '';
}
