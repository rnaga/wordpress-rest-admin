import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
import Create from './Create';

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

