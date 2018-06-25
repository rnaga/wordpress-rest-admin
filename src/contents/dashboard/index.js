import createContent from '../../util/createContent';

import List from './List';

export default createContent( 'dashboard', () => ({
    label: 'Dashboard',
    icon: 'Dashboard',
    routes: {
        _default: {label: 'Dashboard',  component: List},
    }
}));

