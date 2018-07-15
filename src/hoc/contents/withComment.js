import React from 'react';
import {compose} from 'recompose';
import Contents from './contents';
import withActions from '../withActions';
import wpUrl from '../../util/wpUrl';
import Checkbox from '@material-ui/core/Checkbox';

const withComment = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        constructor(props){
            super(props);
            this._statuses = {};
        }

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            component[namespace] = Object.assign(component[namespace], {
                _commentSelf: this,
                handleSubmit: this.handleSubmit.bind(component),
                approveIcon: this.approveIcon.bind(component),
                updateStatus: this.updateStatus.bind(component),
            });
        }

        approveIcon(itemValue){

            const id = itemValue.id;
            const _self = this;
            const _commentSelf = this[namespace]._commentSelf;

            if(!_commentSelf._statuses[id])
                _commentSelf._statuses[id] = itemValue.status;

            const status = _commentSelf._statuses[id];
            const newStatus = _commentSelf._statuses[id] === 'approved' ? 'hold' : 'approved';

            const onClick = () => {
                _commentSelf._statuses[id] = newStatus;
                _self[namespace].updateStatus({id, status: newStatus});
            }; 

            return (<div><Checkbox
                checked={status === 'approved'}
                onChange={onClick} /></div>);
        }

        updateStatus({id, status}){
            const {http} = this.props;
            http('_submit_status', {
                url: wpUrl().path(`comments/${id}`).url,
                method: 'POST',
                isProtected: true,
                options: {
                    payload: {status}
                },
            });
        }

        handleSubmit(value, after = null){

            const {startAction, endAction, http} = this.props;
            const {commentId} = this[namespace]._options;

            startAction();
    
            http('_submit', {
    
                url: wpUrl().path(`comments/${commentId || ''}`).url, 
                method: 'POST',
                isProtected: true,
                options: {
                    payload: value
                },
                onSuccess: response => {
                    endAction({message: 'Successfully Updated'});
                    if(typeof after === 'function') 
                        after();
                }
            });
        }
    }

    return compose(withActions())(Hoc);
}

export default withComment;


