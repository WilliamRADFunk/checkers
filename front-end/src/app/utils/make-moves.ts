import { makeMove } from './make-move';
import { Board } from '../models/board';
import { Cell } from '../models/cell';

export function makeMoves(boardState: Board, moveChainIds: number[], moveChainCells: Cell[]): void {
    let chainLength = moveChainIds.length;
    while (chainLength >= 2) {
        if (Math.abs(Math.floor(moveChainIds[0] / 10) - Math.floor(moveChainIds[1] / 10)) < 2) {
            makeMove(
                boardState,
                moveChainCells[0].position[0],
                moveChainCells[0].position[1],
                moveChainCells[1].position[0],
                moveChainCells[1].position[1],
                []);
        } else {
            const lowerNum = moveChainIds[0] < moveChainIds[1] ? moveChainIds[0] : moveChainIds[1];
            const diff = Math.abs(moveChainIds[0] - moveChainIds[1]);
            const eliminatedCellId = lowerNum + Math.floor(diff / 2) + (diff % 2);
            const row = Math.floor(eliminatedCellId / 10);
            const col = eliminatedCellId % 10;
            const pos = boardState.cellStates[row][col].position;
            makeMove(
                boardState,
                moveChainCells[0].position[0],
                moveChainCells[0].position[1],
                moveChainCells[1].position[0],
                moveChainCells[1].position[1],
                [pos[0], pos[1]]);
        }
        moveChainCells.shift();
        moveChainIds = moveChainIds.slice(1);
        chainLength = moveChainIds.length;
    }
}
