import React from 'react';
import {compose} from 'recompose';
import Dropzone from '../../components/Dropzone';
import withHttp from '../../hoc/withHttp';
import wpUrl, {wpUrlMedia} from '../../util/wpUrl';
import mediaClient from '../../services/mediaClient';
import GridList from '../../components/GridList';
import withGridList from '../../hoc/contents/withGridList';
import withMedia from '../../hoc/contents/withMedia';
import withActions from '../../hoc/withActions';
import withDropzone from '../../hoc/withDropzone';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
        this.toggle = false;
        this.toggleDropzone = this.toggleDropzone.bind(this);
    }

    toggleDropzone(){
        const {openDropzone, closeDropzone} = this.props;
        this.toggle = !this.toggle;
        return this.toggle ? openDropzone() : closeDropzone();
    }

    componentWillMount(){

        const {list, media} = this.props;

        media.bind(this);

        list.bind(this, {
            httpList: this.httpItems,
            pageArgs: {
                context: 'edit',
                per_page: 20,
                page: 1,
                orderby: 'date',
                order: 'desc',
            },
            addNewButton: {
                onClick: e => this.toggleDropzone()
            }
        });
    } 

    httpItems(){

        const {http} = this.props;
        const {parseHttpResponse, resetItems, updateItems} = this.list;

        resetItems();

        http('_media', {
            url: wpUrlMedia(this.list.pageArgs).url,
            method: 'GET',
            isProtected: true,
            onSuccess: response => {
                const {items, itemsCount} = parseHttpResponse(response);
                updateItems({items, itemsCount});
           },

        });
    }

    handleDrop(key, file){

        const {http, startAction, endAction, __reloadContent} = this.props;

        startAction();

        http('_media_post', {
            httpClient: mediaClient,
            url: wpUrl().path('media').url,
            method: 'POST',
            isProtected: true,
            options: {
                payload: file,
            },
            onSuccess: () => {
                endAction({message: 'Successfully Uploaded'});
                __reloadContent();
            }
        });

    }

    render(){

        const {gridlistProps} = this.list;
        const {editButton} = this.media;

        return (<div>

          <Dropzone
            onChange={this.handleDrop.bind(this)}
          />

          <div style={{padding: '5px 0'}} /> 

          <GridList {...(gridlistProps())} actionIcon={item => editButton({edit: item, style: {color: '#F6F6F6'}})}/>

        </div>);
    }

}

export default compose(
    withHttp(),
    withGridList({namespace: 'list'}),
    withMedia({namespace: 'media'}),
    withActions(),
    withDropzone(),
)(List);


