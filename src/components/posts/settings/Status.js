import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import moment from 'moment';
import withStyles from '../../../hoc/withStyles';
import DatetimeField from '../../forms/DatetimeField';
import SwitchField from '../../forms/SwitchField';
import SelectField from '../../forms/SelectField';
import caches from '../../../util/caches';

const publishStatus = [
    { label: 'Publish', value: 'publish'},
    { label: 'Draft', value: 'draft'},
    { label: 'Pending Review', value: 'pending'},
];

const futureStatus = [
    { label: 'Scheduled', value: 'future'},
    { label: 'Draft', value: 'draft'},
    { label: 'Pending Review', value: 'pending'},
];

class Status extends React.Component {

    constructor(props){
        super(props);

        const {edit = {}} = props;
        
        this.state = {
            _status: edit,
        };

        this.isPublishStatus = this.isPublishStatus.bind(this);

        this.inputs = {};
     
    }

    isPublishStatus(){
        const {status: publishStatus = 'publish'} = this.state._status;

        return publishStatus === 'publish' ||
               publishStatus === 'future' || 
               publishStatus === 'draft' ||
               publishStatus === 'pending';
    }

    isFuture(){

        const {date} = this.state._status;
        const site = caches('site');
        const gmtOffset = site.get().gmt_offset * 60;

        const dateCurrent = moment(moment().utcOffset(gmtOffset).format('YYYY-MM-DDTHH:mm:ss'));

        return moment(date).diff(dateCurrent) > 0;        
    }

    handleChange(key, value){

        const {_status} = this.state;

        var newStatus = Object.assign({}, _status, {[key]: value});
        this.setStatus(newStatus);
    }

    setStatus(newStatus){

        const {_status} = this.state;

        var date = newStatus.date || _status.date;
        var status = newStatus.status || _status.status;

        const newDate = moment(date);
        const site = caches('site');
        const gmtOffset = site.get().gmt_offset * 60;
        const dateCurrent = moment(moment().utcOffset(gmtOffset).format('YYYY-MM-DDTHH:mm:ss'));


        if(newDate.diff(dateCurrent) > 0 && status === 'publish'){
            newStatus = Object.assign({}, newStatus, {'status': 'future'});
        }else if(newDate.diff(dateCurrent) < 0 && status === 'future'){
            newStatus = Object.assign({}, newStatus, {'status': 'publish'});
        }

        if(this.inputs.status && this.inputs.status.onChange)
            this.inputs.status.onChange(newStatus.status);

        this.setState({_status: newStatus});        
    }

    handleDatetimeChange(value){
        
        const {_status} = this.state;

        const newDate = moment(value);

        var newStatus = Object.assign({}, _status, {'date': newDate.format('YYYY-MM-DDTHH:mm:ss')})

        this.setStatus(newStatus);
    }

    render(){

//        const {cssStyles, edit} = this.props;
        const {_status} = this.state; 

        const publishOptions = this.isFuture() 
                             ? futureStatus
                             : publishStatus 

        const _self = this;

        return (<div>

              <Field
                component={DatetimeField}
                id="date"
                name="date"
                label="Date"
                defaultValue={_status.date}
                type="datetime-local" 
                onInputChange={this.handleDatetimeChange.bind(this)}
                onMount={ input => {
                    _self.inputs.date = input;
                }}
              />

              {this.isPublishStatus() &&
              (<Field
                component={SelectField}
                id="status"
                name="status"
                label="Publish"
                defaultValue={_status.status || 'draft'}
                onInputChange={v => {
                    this.handleChange('status', v)
                }}
                onMount={ input => {
                    _self.inputs.status = input;
                }}
                options={publishOptions}
                style={{width: '100%'}}
                styleDiv={{paddingTop: 0}}
              />)}

              {_status.status === 'publish' && 
              (<Field
                component={SwitchField}
                id="sticky"
                name="sticky"
                label="Stick to the front page"
                defaultValue={_status.sticky}
                onMount={ input => {
                    _self.inputs.sticky = input;
                }}
              />)}

              {(this.isPublishStatus() || 
                _status.status === 'private') &&
              (<Field
                component={SwitchField}
                id="private"
                name="private"
                label="Private"
                defaultValue={_status && _status.status === 'private'}
                onInputChange={v => {
                    this.handleChange('status', v === true ? 'private' : 'publish'); 
                }}
                onMount={ input => {
                    _self.inputs.private = input;
                }}
              />)}

        </div>);

    }
}

export default compose(
    withStyles,
)(Status);

