import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
import Create from './Create';

const routes = {
    _default: {label: 'Posts',  component: List},
    Edit:     {label: 'Edit Post',   component: Edit},
    Create:   {label: 'Create Post', component: Create},
};

export default createContent( 'posts', ({basePath, contentBasePath}) => ({
    label: 'Posts',
    icon: 'Folder',
    navProps: {isCapableOf: ['edit_posts']},
    routes, 
    subMenus: [
        {label: 'All Posts', linkTo: `${contentBasePath}`},
        {label: 'Add New', linkTo: `${contentBasePath}/Create`},
        {label: 'Categories', linkTo: `${basePath}/categories`, navProps: {isCapableOf: ['manage_categories']}},
        {label: 'Tags', linkTo: `${basePath}/tags`, navProps: {isCapableOf: ['manage_categories']}},
    ]
}));
