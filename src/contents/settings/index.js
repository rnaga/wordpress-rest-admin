import createContent from '../../util/createContent';
import Edit from './Edit';

export default createContent( 'settings', () => ({
    label: 'Settings',
    icon: 'Settings',
    navProps: {adminOnly: true},
    routes: {
         _default: {label: 'Edit Settings',  component: Edit},
    }
}));

