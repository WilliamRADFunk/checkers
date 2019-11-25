import { AIChoiceTrack } from '../models/ai-choice-track';

export function findMaxScore(tracks: AIChoiceTrack[]): AIChoiceTrack {
    console.log('findMaxScore', tracks);
    let maxAIChoiceTrack = { moveChainIds: [], score: -Infinity };
    let index = 0;
    while (tracks[index]) {
        if (tracks[index].moveChainIds.length < 2) {
            // If it doesn't have two or more ids it isn't a valid move.
        } else if (maxAIChoiceTrack.score < tracks[index].score) {
            maxAIChoiceTrack = tracks[index];
        }
        index++;
    }
    return maxAIChoiceTrack;
}