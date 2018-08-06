import createContent from 'wordpress-rest-admin/util/createContent';
import List from './List';

export default createContent( 'media', ({contentBasePath}) => ({
    label: 'Media',
    icon: 'Image',
    navProps: {isCapableOf: ['upload_files']},
    routes: {
        _default: {label: 'Media',  component: List},
    }
}));

