import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import TextField from '../../components/forms/TextField';
import Contents from './contents';
import withActions from '../withActions';
import withDialogForm from '../../hoc/withDialogForm';
//import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import IconActionButton from '../../components/IconActionButton';
import wpUrl from '../../util/wpUrl';

const withTag = ({namespace}) => WrappedComponent => {

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
            const {id = '', name = '', slug = '', description = ''} = edit;
            

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
                 defaultValue={slug}  
                 fullWidth
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
                form: '_tags',
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
                title: 'Edit Tag',
            });

        }

        handleSubmit(value,  after = null){

            const {startAction, endAction, http} = this.props;

            const tagId = value.id || '';

            startAction();

            http('_submit', {
    
                url: wpUrl().path(`tags/${tagId}`).url, 
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

        handleDelete({tagId, after = (() => {})}){
   
            const {http, startAction, endAction, confirmAction} = this.props;
 
            const httpDelete = () => {
    
                startAction();
  
                http('_delete', {
                    url: wpUrl().path(`tags/${tagId}`).url, 
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
                message: 'Are you sure you want to delete this tag?'});
        }

    }

    return compose(withActions(), withDialogForm(),)(Hoc);
}

export default withTag;


