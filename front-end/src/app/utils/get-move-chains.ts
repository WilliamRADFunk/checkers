import { Board } from '../models/board';
import { checkForCycles } from './check-for-cycles';
import { convertIdsToCells } from './convert-ids-to-cells';
import { findClickableCells } from './find-clickable-cells';

export function getMoveChains(board: Board, currPlayer: number, previousChain: number[], depth: number): number[][] {
    const newMoves = findClickableCells(currPlayer, board, convertIdsToCells(board, previousChain));
    // Base case: No moves left to make along this path.
    if (!newMoves.length) {
        return [previousChain];
    }
    // Still some moves on this path available. See where they take us.
    const results = [];
    newMoves.forEach(move => {
        const prospectiveChain = [...previousChain, move];
        if (!checkForCycles(prospectiveChain)) {
            console.log('prospectiveChain', prospectiveChain);
            getMoveChains(board, currPlayer, [...previousChain, move], depth).forEach(chain => {
                results.push(chain);
            });
        }
    });
    return [previousChain, ...results];
}
