import {
    resetTargetBoard, resetCurrentBoard,
    $levels, $boardSizeString,
    MIN_BOARD_SIZE, MAX_BOARD_SIZE
} from './views.js';

const $menuVisibility = X.toReactive(true);

export const menu = D.Mask({
    id: 'menu-mask',
    style: {
        display: $menuVisibility.map(
            visible => visible ? 'block' : 'none'
        ),
    },
},
    D.DialogWindow({
        id: 'menu',
        style: {
            textAlign: 'center',
        },
    },
        X.createElement('h1', {
            class: D.HIGHLIGHT_CLASS,
            style: {
                display: 'block',
                marginBottom: '.3em',
                fontSize: '1.8em',
            },
        },
            '翻转',
        ),
        X.createElement('form', {
            action: 'javascript:;',
            style: {
                marginBottom: '1em',
            },
        },
            X.createElement('label', {
                for: 'size-input',
            },
                '方阵大小：',
            ),
            D.TextInput({
                id: 'size-input',
                type: 'number',
                min: MIN_BOARD_SIZE,
                max: MAX_BOARD_SIZE,
                bind: $boardSizeString,
                style: {
                    width: '3em',
                },
            }),
        ),
        D.Section(null,
            D.Button({
                listeners: {
                    click() {
                        $levels.setSync(1);
                        resetTargetBoard();
                        resetCurrentBoard();
                        $menuVisibility.setSync(false);
                    },
                },
            },
                '开始',
            ),
        ),
        D.Section(null,
            D.Link({
                title: 'GitHub repo',
                href: 'https://github.com/huang2002/turn-over',
            },
                'GitHub',
            ),
        ),
    ),
);
