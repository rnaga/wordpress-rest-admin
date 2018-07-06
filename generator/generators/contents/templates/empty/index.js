import createContent from 'wordpress-rest-admin/util/createContent';

import List from './List';
import Edit from './Edit';
import Create from './Create';

export default createContent( '<%= name %>', ({contentBasePath}) => ({
    label: '<%= label %>',
    icon: '<%= icon %>',
    routes: {
        _default: {label: '<%= label %>',  component: List},
        Edit:     {label: 'Edit <%= label %>',   component: Edit},
        Create:   {label: 'Create <%= label %>', component: Create},
    }
}));

