import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {DashboardCard, DashboardLink} from '../Dashboard';
import Form from '../Form';
import TextField from '../forms/TextField';
import CommentField from '../forms/CommentField';
import withPost from '../../hoc/contents/withPost';
import withHttp from '../../hoc/withHttp';
import withStyles from '../../hoc/withStyles';
import withAuth from '../../hoc/withAuth';
import withWidth from '../../hoc/withWidth';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import wpUrl from '../../util/wpUrl';
import striptags from '../../util/striptags';
import adminUrl from '../../util/adminUrl';

class SaveDraft extends React.Component{

    constructor(props){
        super(props);
        this.drafts = [];
        this.httpItems.bind(this);
        this.state = {
            loading: true,
        };
    }

    componentWillMount(){

        const {post} = this.props;
        const _self = this;

        post.bind(this, {
            postId: null,
            submitAfter: json => {
                _self.resetForm();
                _self.httpItems();
            },
        });

        this.httpItems();
    }

    httpItems(){

        const {http} = this.props;
        const _self = this;

        http('_posts', {
            url: wpUrl().path('posts').query({per_page: 5, status: 'draft'}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                _self.drafts = httpNormalizeResponseBody({response});
                _self.setState({loading: false});
            }

        });
    }

    handleSubmit(value){
        value.status = 'draft';
        this.post.handleSubmit(value);
    }

    handleFormMount(formProps, {resetForm}){
        this.formProps = formProps;
        this.resetForm = resetForm;
    }

    render(){

        const {width, style = {}, cssStyles} = this.props;

        return (
          <DashboardCard style={style} label='Quick Draft' loading={this.state.loading}>

            <Form form='_save_draft' 
              onSubmit={this.handleSubmit.bind(this)} 
              onMount={this.handleFormMount.bind(this)}>

              <Field 
                component={TextField} 
                id='title'
                name='title'
                label='Title'
                style={{width: '100%'}}
                cssRoot={cssStyles.dashboardQuickDraftTextFieldRoot}
              />

              <Field
                component={CommentField}
                id="content"
                name="content"
                label="Content"
                style={{width: '100%'}}
              />

              <Button 
                style={width === 'sm'? {marginTop: 30, border: '1px solid'} : {border: '1px solid'}}
                variant='flat' 
                color='primary' 
                size='small' 
                type='submit'>Save Draft</Button>

            </Form>

            <div style={{width: '100%'}}>
            <Typography style={{fontSize: '0.8rem', fontWeight: 550, paddingTop: 10}}>
              Your Recent Drafts 

              <DashboardLink to={adminUrl('posts').query({status: 'draft'}).url} >
                <span style={{float: 'right', fontWeight: 250}}>
                  View all drafts
                </span>
              </DashboardLink>
            </Typography>
            {this.drafts.map( (draft, i) => {
                return (<div key={i} style={{margin: 10, backgrounColor: '#eee'}}>
                  <DashboardLink to={`${adminUrl('posts', 'Edit').url}/${draft.id}`} >
                    {draft.title.rendered} 
                  </DashboardLink>
                  <Typography style={{display: 'inline', fontSize: '0.8rem', color: '#72777c', paddingLeft: 10}}>
                  {moment(draft.date).format('MMM, DD YYYY')}
                  </Typography>
                  <div style={{overflowWrap: 'break-word'}}>
                    {striptags(draft.content.rendered)}
                  </div>
                </div>)
            })}
            </div>
          </DashboardCard>);

    }
}

export default compose(
    withStyles,
    withPost({namespace: 'post'}),
    withHttp(),
    withWidth(),
    withAuth(),
)(SaveDraft);

