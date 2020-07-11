import { resetCurrentBoard } from './views.js';

const HELP_INFO =
    '点击当前方阵中的一个格子，让它和相邻4个格子颜色翻转；'
    + '使当前方阵与目标方阵相同以进入下一关。（关卡随机生成）';

export const toolbar = X.createElement('div', {
    id: 'toolbar',
    style: {
        paddingTop: '1em',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflowX: 'auto',
    },
},
    D.Button({
        listeners: {
            click() {
                alert(HELP_INFO);
            },
        },
    },
        '帮助',
    ),
    D.Button({
        listeners: {
            click() {
                resetCurrentBoard();
            },
        },
    },
        '重置',
    ),
);
