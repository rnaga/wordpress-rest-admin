import React from 'react';
import {Field} from 'redux-form';
import SwitchField from '../../forms/SwitchField';

class StatusNoPublish extends React.Component {

    render(){

        const {edit} = this.props;

        return (<div>
              <Field
                component={SwitchField}
                id="submit_for_review"
                name="submit_for_review"
                label="Submit For Review"
                defaultValue={edit.status === 'pending'}
              />
        </div>);

    }
}

export default StatusNoPublish;

