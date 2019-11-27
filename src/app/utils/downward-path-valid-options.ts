import { Cell } from '../models/cell';

export function downwardPathValidOptions(activePlayer: number, cell: Cell, board: Cell[][]): number[] {
    const ids = [];
    const lowerLeft = [cell.position[0] + 1, cell.position[1] - 1];
    const lowerRight = [cell.position[0] + 1, cell.position[1] + 1];
    if (lowerLeft[0] <= 7 && lowerLeft[1] >= 0) {
        if (!board[lowerLeft[0]][lowerLeft[1]].value) {
            ids.push(board[lowerLeft[0]][lowerLeft[1]]);
        } else if (board[lowerLeft[0]][lowerLeft[1]].player !== activePlayer) {
            const jumpedLowerLeft = [lowerLeft[0] + 1, lowerLeft[1] - 1];
            if (jumpedLowerLeft[0] <= 7 && jumpedLowerLeft[1] >= 0 && !board[jumpedLowerLeft[0]][jumpedLowerLeft[1]].value) {
                ids.push(board[jumpedLowerLeft[0]][jumpedLowerLeft[1]]);
            }
        }
    }
    if (lowerRight[0] <= 7 && lowerRight[1] <= 7) {
        if (!board[lowerRight[0]][lowerRight[1]].value) {
            ids.push(board[lowerRight[0]][lowerRight[1]]);
        } else if (board[lowerRight[0]][lowerRight[1]].player !== activePlayer) {
            const jumpedlowerRight = [lowerRight[0] + 1, lowerRight[1] + 1];
            if (jumpedlowerRight[0] <= 7 && jumpedlowerRight[1] <= 7 && !board[jumpedlowerRight[0]][jumpedlowerRight[1]].value) {
                ids.push(board[jumpedlowerRight[0]][jumpedlowerRight[1]]);
            }
        }
    }
    return ids.map(c => c.id);
}
