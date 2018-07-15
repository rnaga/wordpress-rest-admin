import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';

export default createContent( 'tags', () => ({
    label: 'Tags',
    icon: 'LocalOffer',
    navProps: {hideMenu: ['full'], isCapableOf: ['manage_categories']},
    routes: {
         _default: {label: 'Tags',  component: List},
    }
}));

