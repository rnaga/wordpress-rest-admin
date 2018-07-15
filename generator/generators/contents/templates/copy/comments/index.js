import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
//import {Edit, Create} from './Edit';

export default createContent( 'comments', () => ({
    label: 'Comments',
    icon: 'Message',
    navProps: {isCapableOf: ['moderate_comments']},
    routes: {
        _default: {label: 'Comments',  component: List},
        Edit:     {label: 'Edit Comment',   component: Edit},
//        Create:   {label: 'Create Comment', component: Create},
    }
}));

