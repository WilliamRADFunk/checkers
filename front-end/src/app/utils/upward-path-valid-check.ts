import { Cell } from '../models/cell';

export function upwardPathValidCheck(activePlayer: number, cell: Cell, board: Cell[][]): boolean {
    const upperLeft = [cell.position[0] - 1, cell.position[1] - 1];
    const upperRight = [cell.position[0] - 1, cell.position[1] + 1];
    if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
        if (!board[upperLeft[0]][upperLeft[1]].value) {
            return true;
        } else if (board[upperLeft[0]][upperLeft[1]].player !== activePlayer) {
            const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
            if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
                return true;
            }
        }
    }
    if (upperRight[0] >= 0 && upperRight[1] <= 7) {
        if (!board[upperRight[0]][upperRight[1]].value) {
            return true;
        } else if (board[upperRight[0]][upperRight[1]].player !== activePlayer) {
            const jumpedUpperRight = [upperRight[0] - 1, upperRight[1] + 1];
            if (jumpedUpperRight[0] >= 0 && jumpedUpperRight[1] <= 7 && !board[jumpedUpperRight[0]][jumpedUpperRight[1]].value) {
                return true;
            }
        }
    }
    return false;
}
