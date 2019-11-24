import { Board } from '../models/board';

export function cloneBoard(origBoard: Board): Board {
    const newBoard = { cellStates: [ [], [], [], [], [], [], [], [] ] };
    const cellStates = origBoard.cellStates;
    cellStates.forEach((row, outerIndex) => {
        row.forEach((cell, innerIndex) => {
            const newCell = {
                player: cell.player,
                playerColor: cell.playerColor,
                position: cell.position,
                value: cell.value
            };
            newBoard.cellStates[outerIndex][innerIndex] = newCell;
        });
    });
    return newBoard;
}