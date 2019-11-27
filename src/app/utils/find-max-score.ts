import { AIChoiceTrack } from '../models/ai-choice-track';

export function findMaxScore(tracks: AIChoiceTrack[]): AIChoiceTrack {
    tracks = tracks.filter(track => track.moveChainIds.length >= 2);
    let maxAIChoiceTrack = tracks.shift();
    while (tracks[0]) {
        if (maxAIChoiceTrack.score < tracks[0].score) {
            maxAIChoiceTrack = tracks[0];
        }
        tracks.shift();
    }
    return maxAIChoiceTrack;
}
