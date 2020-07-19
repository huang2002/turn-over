const MIN_TURNS = 2;
const MAX_TURNS = 20;

/**
 * @typedef {boolean[]} Board
 */

/**
 * @param {number} size
 * @return {Board}
 */
export const createBoard = size => (
    Array.from({ length: size * size }, () => false)
);

/**
 * @param {Board} board
 * @param {number} size
 * @param {number} index
 */
export const turnOver = (board, size, index) => {

    board[index] = !board[index];

    const mod = (index + 1) % size;
    if (mod !== 1) { // left
        board[index - 1] = !board[index - 1];
    }
    if (mod !== 0) { // right
        board[index + 1] = !board[index + 1];
    }

    const row = Math.floor(index / size) + 1;
    if (row > 1) { // top
        board[index - size] = !board[index - size];
    }
    if (row < size) { // bottom
        board[index + size] = !board[index + size];
    }

};

/**
 * @param {X.ToReactive<Board>} $board
 * @param {Board} newBoard
 */
export const updateBoard = ($board, newBoard) => {
    newBoard.forEach((value, index) => {
        if ($board.current[index] !== value) {
            $board.replace(index, value);
        }
    });
};

/**
 * @param {Board} board
 */
export const isEmptyBoard = board => board.every(value => !value);

/**
 * @param {number} floor
 * @param {number} ceiling
 * @returns [floor, ceiling)
 */
const random = (floor, ceiling) => (
    Math.floor(floor + (ceiling - floor) * Math.random())
);

/**
 * @param {number} size
 * @param {number} difficulty
 * @returns {Board}
 */
export const createPuzzle = (size, difficulty) => {
    console.log('# new puzzle');
    const board = createBoard(size);
    const turns = Math.floor(MIN_TURNS + (MAX_TURNS - MIN_TURNS) * difficulty);
    const length = size * size;
    for (let i = 0; i < turns; i++) {
        const x = random(0, length);
        turnOver(board, size, x);
        console.log(x);
    }
    return board;
};
