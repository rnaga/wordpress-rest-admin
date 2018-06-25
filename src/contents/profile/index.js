import createContent from '../../util/createContent';

import Edit from './Edit';

export default createContent( 'profile', ({contentBasePath}) => ({
    label: 'Profile',
    icon: 'Person',
    routes: {
        _default: {label: 'Profile',  component: Edit},
    },
}));

