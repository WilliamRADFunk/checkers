import { Cell } from './cell';

export interface Board {
    activePlayer?: number;
    cellStates: Cell[][];
    gameStatus?: number;
}
