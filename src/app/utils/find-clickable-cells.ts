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
    // If player's last move was not a jump, no further jumps are possible.
    if (chainLength > 1 && Math.abs(moveChainCells[chainLength - 2].id - moveChainCells[chainLength - 1].id) < 12) {
        return [];
    }
    // If no moves have been made yet, find all player's pieces and return their ids.
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
            ids.push(cell.id);
        });
        return ids;
    }
    let possibleMoves = [];
    // If a king, combine upward and downward, otherwise restrict to direction of player.
    if (moveChainCells[0].value === 2) {
        possibleMoves = [
            ...upwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates),
            ...downwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates)
        ];
    } else {
        possibleMoves = direction === 1
            ? upwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates)
            : downwardPathValidOptions(direction, moveChainCells[chainLength - 1], cellStates);
    }
    // If the last move in the move chain was to jump an opponent piece, make sure only additional jumps are available.
    if (chainLength > 1) {
        possibleMoves = possibleMoves.filter(move => Math.abs(move - moveChainCells[chainLength - 1].id) > 11);
    }
    return possibleMoves;
}
