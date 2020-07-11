import { views } from './views.js';
import { toolbar } from './toolbar.js';
import { menu } from './menu.js';
import { header } from './header.js';

document.body.appendChild(
    X.createElement('div', {
        id: 'app',
        style: {
            display: 'flex',
            position: 'fixed',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            padding: '1em',
            flexDirection: 'column',
        },
    },
        header,
        views,
        toolbar,
        menu,
    )
);
