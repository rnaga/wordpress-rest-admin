import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';

export default createContent( 'categories', () => ({
    label: 'Categories',
    icon: 'ColorLens',
    navProps: {hideMenu: ['full'], isCapableOf: ['manage_categories']},
    routes: {
         _default: {label: 'Categories',  component: List},
    }
}));

