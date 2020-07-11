import { createBoard, turnOver, createPuzzle, isSameBoard, updateBoard } from './board.js';

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
 * @type {X.ToReactive<import('./board').Board>}
 */
const $targetBoard = X.toReactive([]);

export const resetTargetBoard = () => {
    const puzzle = createPuzzle(
        +$boardSize.current,
        Math.min(1, $levels.current / MAX_DIFFICULTY_LEVEL),
    );
    $targetBoard.setSync(puzzle);
};

/**
 * @type {X.ToReactive<import('./board').Board>}
 */
const $currentBoard = X.toReactive([]);

export const resetCurrentBoard = () => {
    $currentBoard.setSync(createBoard(+$boardSize.current));
};

const $viewSize = X.toReactive(100);
const $viewSizeInPixel = $viewSize.map(viewSize => `${viewSize}px`);

const $viewItemSizeInPercentage = $boardSize.map(
    boardSize => `${VIEW_ITEM_TOTAL_SIZE / +boardSize}%`
);

let resizeTimer = null;
const _resizeView = () => {
    resizeTimer = null;
    const rect = views.getBoundingClientRect();
    $viewSize.setSync(
        VIEW_TOTAL_SIZE * Math.max(
            Math.min(rect.width, rect.height / 2),
            Math.min(rect.width / 2, rect.height),
        )
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
    transform: 'scale(.9)',
});

const TargetViewItem = X.createComponent(
    /**
     * @param {X.ReactiveValue<boolean>} $value
     */
    $value => (
        X.createElement('div', {
            class: VIEW_ITEM_CLASS,
            style: {
                backgroundColor: $value.map(
                    value => value ? COLOR_INVERSE : COLOR_INIT
                ),
            },
        })
    )
);

const CURRENT_VIEW_ITEM_CLASS = X.createClass({
    outline: 'none',
    boxShadow: [
        'inset 2px 2px 3px rgba(255,255,255,.3)',
        'inset -2px -2px 3px rgba(0,0,0,.3)',
    ].join(','),
    cursor: 'pointer',
}, {
    ':focus': {
        borderColor: '#222',
    },
});

const CurrentViewItem = X.createComponent(
    /**
     * @param {X.ReactiveValue<boolean>} $value
     * @param {X.ReactiveValue<number>} $index
     */
    ($value, $index) => (
        X.createElement('button', {
            class: [VIEW_ITEM_CLASS, CURRENT_VIEW_ITEM_CLASS],
            style: {
                backgroundColor: $value.map(
                    value => value ? COLOR_INVERSE : COLOR_INIT
                ),
            },
            listeners: {
                click() {
                    const currentBoard = $currentBoard.current.slice();
                    turnOver(currentBoard, +$boardSize.current, $index.current);
                    updateBoard($currentBoard, currentBoard);
                    if (isSameBoard(currentBoard, $targetBoard.current)) {
                        $levels.set(levels => levels + 1);
                        resetTargetBoard();
                        resetCurrentBoard();
                    }
                },
            },
        })
    )
);

const VIEW_CLASS = X.createClass({
    display: 'inline-block',
    width: $viewSizeInPixel,
    height: $viewSizeInPixel,
    lineHeight: '0',
});

export const views = X.createElement('div', {
    id: 'views',
    style: {
        display: 'flex',
        flex: '1',
        textAlign: 'center',
        overflow: 'hidden',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
},
    $targetBoard.toElement('div', {
        class: VIEW_CLASS,
    },
        TargetViewItem
    ),
    $currentBoard.toElement('div', {
        class: VIEW_CLASS,
    },
        CurrentViewItem
    ),
);
