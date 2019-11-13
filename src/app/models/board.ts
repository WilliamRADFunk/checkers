import { Cell } from './cell';

export interface Board {
    boardRegistryIndex: number;
    cellStates: Cell[][];
    inputPrimers: Cell[];
    isSolved: boolean;
    level: number;
}
