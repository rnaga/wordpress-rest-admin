import createContent from '../../util/createContent';

import List from './List';
import {Edit, Create} from './Edit';

export default createContent( 'users', ({contentBasePath}) => ({
    label: 'Users',
    icon: 'Group',
    navProps: {adminOnly: true},
    routes: {
        _default: {label: 'Users',  component: List},
        Edit:     {label: 'Edit User',   component: Edit},
        Create:   {label: 'Create User', component: Create},
    },
    subMenus: [
        {label: 'All Users', linkTo: `${contentBasePath}`},
        {label: 'Add New', linkTo: `${contentBasePath}/Create`},
    ]
}));

