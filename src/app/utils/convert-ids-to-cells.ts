import { Board } from '../models/board';
import { Cell } from '../models/cell';

export function convertIdsToCells(board: Board, moveChainIds: number[]): Cell[] {
    const moveChainCells = [];
    moveChainIds.forEach(id => {
        const row = Math.floor(id / 10);
        const col = id % 10;
        moveChainCells.push(board.cellStates[row][col]);
    });
    return moveChainCells;
}
