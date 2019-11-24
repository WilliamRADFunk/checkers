import { Board } from '../models/board';
import { Cell } from '../models/cell';
import { downwardPathValidCheck } from './downward-path-valid-check';
import { downwardPathValidOptions } from './downward-path-valid-options';
import { findPiecesForPlayer } from './find-pieces-for-player';
import { upwardPathValidCheck } from './upward-path-valid-check';
import { upwardPathValidOptions } from './upward-path-valid-options';

export function findClickableCells(direction: number, boardState: Board, moveChainCells: Cell[]): number[] {
    const cellStates = boardState.cellStates;
    const chainLength = moveChainCells.length;
    if (!chainLength) {
        let playerPieces = findPiecesForPlayer(direction, boardState);
        playerPieces = playerPieces.filter(cell => {
            // If a king, combine upward and downward, otherwise restrict to direction of player.
            if (cell.value === 2) {
                return upwardPathValidCheck(direction, cell, cellStates)
                    || downwardPathValidCheck(direction, cell, cellStates);
            } else {
                return direction === 1
                    ? upwardPathValidCheck(direction, cell, cellStates)
                    : downwardPathValidCheck(direction, cell, cellStates);
            }
        });
        const ids = [];
        playerPieces.forEach(cell => {
            ids.push(Number(`${cell.position[0]}${cell.position[1]}`));
        });
        return ids;
    }
    // If a king, combine upward and downward, otherwise restrict to direction of player.
    if (moveChainCells[0].value === 2) {
        return [
            ...upwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates),
            ...downwardPathValidOptions(direction, moveChainCells[chainLength - 1
        ], cellStates)];
    } else {
        return direction === 1
            ? upwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates)
            : downwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates);
    }
}