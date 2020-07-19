import { turnOver, createPuzzle, isEmptyBoard, updateBoard, createBoard } from './board.js';

const RESIZE_DELAY = 100;
const COLOR_INIT = '#F9F9F9';
const COLOR_INVERSE = '#36F';
const VIEW_TOTAL_SIZE = .9; // * 100%
const VIEW_ITEM_TOTAL_SIZE = 99; // * 1%
const MAX_DIFFICULTY_LEVEL = 32;

export const MIN_BOARD_SIZE = 6;
export const MAX_BOARD_SIZE = 20;

export const $boardSizeString = X.toReactive('6');
export const $levels = X.toReactive(0);

const $boardSize = $boardSizeString.map(value => (
    Math.min(
        MAX_BOARD_SIZE,
        Math.max(MIN_BOARD_SIZE, +value || 0),
    )
));

/**
 * @type {Board}
 */
let currentPuzzle;

export const initPuzzle = () => {
    currentPuzzle = createPuzzle(
        +$boardSize.current,
        Math.min(1, $levels.current / MAX_DIFFICULTY_LEVEL),
    );
    if ($currentBoard.current.length !== currentPuzzle.length) {
        $currentBoard.setSync(createBoard(+$boardSize.current));
    }
    updateBoard($currentBoard, currentPuzzle);
};

/**
 * @type {X.ToReactive<import('./board').Board>}
 */
const $currentBoard = X.toReactive([]);

export const resetPuzzle = () => {
    updateBoard($currentBoard, currentPuzzle);
};

const $viewSize = X.toReactive(100);
const $viewSizeInPixel = $viewSize.map(viewSize => `${viewSize}px`);

const $viewItemSizeInPercentage = $boardSize.map(
    boardSize => `${VIEW_ITEM_TOTAL_SIZE / +boardSize}%`
);

let resizeTimer = null;
const _resizeView = () => {
    resizeTimer = null;
    const rect = view.getBoundingClientRect();
    $viewSize.setSync(
        VIEW_TOTAL_SIZE * Math.min(rect.width, rect.height)
    );
};
const resizeView = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(_resizeView, RESIZE_DELAY);
};

window.addEventListener('resize', resizeView);
resizeView();

const VIEW_ITEM_CLASS = X.createClass({
    display: 'inline-block',
    width: $viewItemSizeInPercentage,
    height: $viewItemSizeInPercentage,
    border: 'solid 1px #666',
    borderRadius: '5px',
    boxShadow: [
        'inset 2px 2px 3px rgba(255,255,255,.3)',
        'inset -2px -2px 3px rgba(0,0,0,.3)',
    ].join(','),
    transform: 'scale(.9)',
    outline: 'none',
    cursor: 'pointer',
}, {
    ':focus': {
        borderColor: '#222',
    },
});

const ViewItem = X.createComponent(
    /**
     * @param {X.ReactiveValue<boolean>} $value
     * @param {X.ReactiveValue<number>} $index
     */
    ($value, $index) => (
        X.createElement('button', {
            class: VIEW_ITEM_CLASS,
            style: {
                backgroundColor: $value.map(
                    value => value ? COLOR_INVERSE : COLOR_INIT
                ),
            },
            listeners: {
                click() {
                    const currentBoard = $currentBoard.current.slice();
                    turnOver(currentBoard, +$boardSize.current, $index.current);
                    if (isEmptyBoard(currentBoard)) {
                        $levels.set(levels => levels + 1);
                        initPuzzle();
                    } else {
                        updateBoard($currentBoard, currentBoard);
                    }
                },
            },
        })
    )
);

export const view = X.createElement('div', {
    id: 'view',
    style: {
        display: 'flex',
        flex: '1',
        overflow: 'hidden',
    },
},
    $currentBoard.toElement('div', {
        style: {
            display: 'inline-block',
            width: $viewSizeInPixel,
            height: $viewSizeInPixel,
            margin: 'auto',
            lineHeight: '0',
        },
    },
        ViewItem
    ),
);
