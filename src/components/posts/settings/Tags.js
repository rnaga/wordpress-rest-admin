import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import withHttp from '../../../hoc/withHttp';
import httpNormalizeResponseBody from '../../../util/httpNormalizeResponseBody';
import AsyncSelectField from '../../forms/AsyncSelectField';
import wpUrl from '../../../util/wpUrl';
import caches from '../../../util/caches';

class Tags extends React.Component {

    constructor(props){
        super(props);
        this.tagsDefaultValue = null;
    }    

    asyncInputChange(value = ''){
        const {http} = this.props;
        return new Promise((resolve, reject) => {
            http('_tags_options', {
                url: wpUrl().path('tags').query({per_page: 100, search: value}).url,
                method: 'GET',
                onSuccess: response => {
                    const body = httpNormalizeResponseBody({response});
                    const options = body.map( v => {
                        return {value: v.id, label: v.name};
                    });

                    resolve(options);
                },
                onFail: error => {
                    reject(error);
                }
            });
        });
    }

    componentWillMount(){

        const {edit, http} = this.props;
        const _self = this;

        if(!edit || !Array.isArray(edit.tags) || 0 >= edit.tags.length){
            this.tagsDefaultValue = [];
            return;
        }

        http('_tags', {
            url: wpUrl().path('tags').query({include: edit.tags.join(',')}).url, 
            method: 'GET',
            onSuccess: response => {
                const body = httpNormalizeResponseBody({response});
                _self.tagsDefaultValue = body.map( v => {
                    return {value: v.id, label: v.name};
                });
            },
            onFail: err => {
                _self.tagsDefaultValue = [];
            }
        });
    }

    render(){

        const account = caches('account');

        return (<div>

          {this.tagsDefaultValue && (<Field
             component={AsyncSelectField}
             id='tagsRaw'
             name='tagsRaw'
             label='Tags'
             multi={true}
             creatable={account.cap.manage_categories}
             style={{width: 300}}
             defaultValue={this.tagsDefaultValue}
             asyncInputChange={this.asyncInputChange.bind(this)}
             asyncDefaultOptions={this.asyncInputChange.bind(this)}
           />)}

          </div>);
    }
}


export default compose(
    withHttp(),
)(Tags);
