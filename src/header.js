import { $levels } from './view.js';

export const header = X.createElement('header', {
    id: 'header',
},
    X.createElement('p', {
        class: D.HIGHLIGHT_CLASS,
        style: {
            display: 'block',
            fontSize: '2em',
            textAlign: 'center',
        },
    },
        $levels.toText(levels => `第${levels}关`)
    )
);
