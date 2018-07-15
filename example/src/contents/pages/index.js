import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
import Create from './Create';

const routes = {
    _default: {label: 'Pages',  component: List},
    Edit:     {label: 'Edit Page',   component: Edit},
    Create:   {label: 'Create Page', component: Create},
};

export default createContent( 'pages', ({contentBasePath}) => ({
    label: 'Pages',
    icon: 'LibraryBooks',
    navProps: {isCapableOf: ['edit_others_pages']},
    routes, 
    subMenus: [
        {label: 'All Pages', linkTo: `${contentBasePath}`},
        {label: 'Add New', linkTo: `${contentBasePath}/Create`},
    ]
}));
