import createContent from '../../util/createContent';
import List from './List';

export default createContent( 'media', ({contentBasePath}) => ({
    label: 'Media',
    icon: 'Image',
    navProps: {isCapableOf: ['upload_files']},
    routes: {
        _default: {label: 'Media',  component: List},
    }
}));

