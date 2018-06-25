import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import TextField from '../../components/forms/TextField';
import AsyncSelectField from '../../components/forms/AsyncSelectField';
import Contents from './contents';
import withActions from '../withActions';
import withDialogForm from '../../hoc/withDialogForm';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import IconActionButton from '../../components/IconActionButton';
import wpUrl from '../../util/wpUrl';

const withCategory = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            const {openDialogForm, closeDialogForm, __reloadContent} = this.props;

            component[namespace] = Object.assign(component[namespace], {
                handleSubmit: this.handleSubmit.bind(component),
                handleDelete: this.handleDelete.bind(component),
                editButton: this.editButton.bind(component),
                renderForm: this.renderForm.bind(component),
                openDialogForm,
                closeDialogForm,
                __reloadContent,
            });
        }

        editButton({edit, style = {}}){
            return (<IconActionButton
              iconStyle={style}
              type={'edit'} 
              onClick={e => this[namespace].renderForm({edit})} 
            />)
        }

        renderForm({edit = {}}){
    
            const {handleSubmit, openDialogForm, closeDialogForm, _options} = this[namespace];
            const {submitAfter} = _options;
            const {http} = this.props;
            const {id = '', name = '', slug = '', description = '', parent = ''} = edit;
            

            const asyncInputChange = (value = '') => {
                return new Promise((resolve, reject) => {
                    http('_categories_form', {
                        url: wpUrl().path('categories').query({per_page: 100, search: value}).url,
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

            const content = (<div>

               <Field
                 component={TextField}
                 id="name"
                 name="name"
                 label="Name"
                 defaultValue={name}
                 fullWidth
                 required />
    
               <Field
                 component={TextField}
                 id="slug"
                 name="slug"
                 label="Slug"
                 fullWidth
                 defaultValue={slug}  />
    
               <Field
                 component={AsyncSelectField}
                 id='parentRaw'
                 name='parentRaw'
                 label='Parent'
                 defaultValue={parent}
                 fullWidth
                 asyncInputChange={asyncInputChange}
                 asyncDefaultOptions={asyncInputChange}
               />
    
               <Field
                 component={TextField}
                 id="description"
                 name="description"
                 label="Description"
                 defaultValue={description}
                 fullWidth
                 multiline
                 rows="4" />
    
            </div>);

            openDialogForm({
                form: '_categories',
                onClose: closeDialogForm,
                onSubmit: value => {
                    value.id = id;
                    handleSubmit(value, () => {
                        closeDialogForm(); 

                        if(typeof submitAfter === 'function')
                            submitAfter();
                    })
                },
                content,
                title: 'Edit Category',
            });

        }

        handleSubmit(value,  after = null){

            const {startAction, endAction, http} = this.props;
//            const {_options = {}} = this[namespace];

            const categoryId = value.id || '';

            if(typeof value.parentRaw === 'object')
                value.parent = value.parentRaw.value;
            else if(typeof value.parentRaw === 'number')
                value.parent = value.parentRaw;

            startAction();

            http('_submit', {
    
                url: wpUrl().path(`categories/${categoryId}`).url, 
                method: 'POST',
                isProtected: true,
                options: {
                    payload: value
                },
                onSuccess: response => {
                    if(typeof after === 'function')
                        after();
                    endAction({message: 'Successfully Updated'});
                }
            });
        }

        handleDelete({categoryId, after = (() => {})}){
   
            const {http, startAction, endAction, confirmAction} = this.props;
 
            const httpDelete = () => {
    
                startAction();
  
                http('_delete', {
                    url: wpUrl().path(`categories/${categoryId}`).url, 
                    method: 'DELETE',
                    isProtected: true,
                    onSuccess: response => {
                        endAction({message: 'Successfully Deleted'});
                        after();
                    }
                });
            }

            confirmAction({
                onYes: httpDelete, 
                message: 'Are you sure you want to delete this user?'});
        }

    }

    return compose(withActions(), withDialogForm(),)(Hoc);
}

export default withCategory;


