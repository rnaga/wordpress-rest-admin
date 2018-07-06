import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
import Create from './Create';

export default createContent( 'mypage', ({contentBasePath}) => ({
    label: 'My Page',
    icon: 'Pages',
    routes: {
        _default: {label: 'My Page',  component: List},
        Edit:     {label: 'Edit My Page',   component: Edit},
        Create:   {label: 'Create My Page', component: Create},
    }
}));

