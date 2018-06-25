import React from 'react';
import {compose} from 'recompose';
import withHttp from '../../hoc/withHttp';
//import adminAjax from '../../services/adminAjax';
import {Field} from 'redux-form';
import Form from '../../components/Form';
import TextField from '../../components/forms/TextField';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import {SaveButton} from '../../components/ActionButton';
import withSettings from '../../hoc/contents/withSettings';
import wpUrl from '../../util/wpUrl';


/*
const dateFormatUrl = 'http://localhost:8080/wordpress/wp-admin/admin-ajax.php';

class DateTimeFormat extends React.Component{

    constructor(props){
        super(props);
        this.preview = this.preview.bind(this);
    }

    componentWillMount(){
        const {defaultValue} = this.props;

        if(defaultValue)
            this.preview(defaultValue);
    }

    preview(value){
        const {http, action} = this.props;

        http('_dateformat', {
            httpClient: adminAjax,
            url: dateFormatUrl,
            method: 'POST',
            options: {
                payload: `action=${action}&date=${value}`
            },
            isProtected: true,
        });
    }

    render(){
//        const {httpGetResponse} = this.props;
//        const dateFormat = httpNormalizeResponseBody(httpGetResponse('_dateformat'));

        return (<div>
          <TextField onBlur={e => this.preview(e.target.value)} style={{display: 'block'}} />

//          preview: {dateFormat}

        </div>);
    }
}

DateTimeFormat = withHttp()(DateTimeFormat);
*/

const textFields = edit => ([
    {id: 'title', label: 'Site Title', defaultValue: edit.title},
    {id: 'description', label: 'Tagline', defaultValue: edit.description},
    {id: 'url', label: 'WordPress Address (URL)', defaultValue: edit.url},
    {id: 'email', label: 'email', defaultValue: edit.email},
]);

class Edit extends React.Component {

    constructor(props){
        super(props);
        this.edit = null;
    }

    componentWillMount(){

        const {http, settings} = this.props;

        settings.bind(this);

        http('_settings', {
            url: wpUrl().path('settings').query({context: 'edit'}).url, //`${settingsUrl}?context=edit`,
            method: 'GET',
            isProtected: true,
            onSuccess: response => {
                this.edit = httpNormalizeResponseBody({response})[0];
            }
        });
    }

    render(){

        if(!this.edit) return null;

        return (<div>
           <Form form='_settings' onSubmit={this.settings.handleSubmit}  >
             {textFields(this.edit).map( (v,k) => {
                 return <Field component={TextField} key={k} id={v.id} name={v.id} label={v.label} defaultValue={v.defaultValue}  />
             })}

             <SaveButton style={{marginLeft: 0}} />
          </Form>
        </div>);
    }
}

/*
const Edit = (props) => (<div style={{paddingTop: 100}}>
    <DateTimeFormat action='date_format' defaultValue='F j, Y' />
    <Get url={`${settingsUrl}?context=edit`} bindProp='edit' isProtected >
      <Success>
        <Create {...props} />
      </Success>
      <Fail>
        failed
      </Fail>
    </Get></div>)
*/

export default compose(
    withSettings({namespace: 'settings'}),
    withHttp(),
)(Edit);





