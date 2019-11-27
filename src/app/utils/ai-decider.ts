import { aiMove } from './ai-move';
import { cloneBoard } from './clone-board';
import { convertBoardToKey } from './convert-board-to-key';
import { convertIdsToCells } from './convert-ids-to-cells';
import { crownKings } from './crown-kings';
import { findMaxScore } from './find-max-score';
import { getAllMoveChains } from './get-all-move-chains';
import { makeMoves } from './make-moves';
import { AIChoiceTrack } from '../models/ai-choice-track';
import { Board } from '../models/board';

export function aiDecider(
    board: Board,
    aiPlayer: number,
    currPlayer: number,
    startingPieces: number[],
    aiDifficulty: number,
    memoizationTable: { [key: string]: number }
): AIChoiceTrack {
    const scores: AIChoiceTrack[] = [];
    getAllMoveChains(board, aiPlayer, startingPieces, 4).forEach(chain => {
        const newBoard = cloneBoard(board);
        makeMoves(newBoard, chain, convertIdsToCells(newBoard, chain));
        crownKings(newBoard);
        const bKey = convertBoardToKey(newBoard, currPlayer === 2 ? 1 : 2);
        if (undefined === memoizationTable[bKey]) {
            memoizationTable[bKey] = aiMove(
                newBoard,
                aiPlayer,
                currPlayer === 2 ? 1 : 2,
                aiDifficulty + 1,
                memoizationTable);
        }
        scores.push({ moveChainIds: chain, score: memoizationTable[bKey] });

        // Pruning the tree. If non-ai player, if minimum is already found stop looking.
        // If ai-player and max is already found, stop looking.
        if (memoizationTable[bKey] === -Infinity && currPlayer !== aiPlayer) {
            console.log('aiDecider bail early for min');
            return { moveChainIds: chain, score: memoizationTable[bKey] };
        } else if (memoizationTable[bKey] === Infinity && currPlayer === aiPlayer) {
            console.log('aiDecider bail early for max');
            return { moveChainIds: chain, score: memoizationTable[bKey] };
        }
    });
    return findMaxScore(scores);
}
