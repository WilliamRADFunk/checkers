export function resetBoard() {
    const board = { cellStates: [] };
    for (let row = 0; row < 8; row++) {
        board.cellStates[row] = [];
        for (let col = 0; col < 8; col++) {
            const cell = {
                id: Number(`${row}${col}`),
                player: 0,
                playerColor: '',
                position: [row, col],
                value: (row % 2) + (col % 2) === 1 ? 1 : 0
            };
            if (row < 3) {
                cell.player = cell.value ? 2 : 0;
                cell.playerColor = cell.value ? 'black' : '';
            } else if (row > 4) {
                cell.player = cell.value;
                cell.playerColor = cell.value ? 'white' : '';
            } else {
                cell.value = 0;
            }
            board.cellStates[row][col] = cell;
        }
    }
    return board;
}
