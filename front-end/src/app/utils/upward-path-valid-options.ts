import { Cell } from '../models/cell';

export function upwardPathValidOptions(activePlayer: number, cell: Cell, board: Cell[][]): number[] {
    const ids = [];
    const upperLeft = [cell.position[0] - 1, cell.position[1] - 1];
    const upperRight = [cell.position[0] - 1, cell.position[1] + 1];
    if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
        if (!board[upperLeft[0]][upperLeft[1]].value) {
            ids.push(board[upperLeft[0]][upperLeft[1]]);
        } else if (board[upperLeft[0]][upperLeft[1]].player !== activePlayer) {
            const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
            if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
                ids.push(board[jumpedUpperLeft[0]][jumpedUpperLeft[1]]);
            }
        }
    }
    if (upperRight[0] >= 0 && upperRight[1] <= 7) {
        if (!board[upperRight[0]][upperRight[1]].value) {
            ids.push(board[upperRight[0]][upperRight[1]]);
        } else if (board[upperRight[0]][upperRight[1]].player !== activePlayer) {
            const jumpedUpperRight = [upperRight[0] - 1, upperRight[1] + 1];
            if (jumpedUpperRight[0] >= 0 && jumpedUpperRight[1] <= 7 && !board[jumpedUpperRight[0]][jumpedUpperRight[1]].value) {
                ids.push(board[jumpedUpperRight[0]][jumpedUpperRight[1]]);
            }
        }
    }
    return ids.map(c => c.id);
}
