import React from 'react';
import {compose} from 'recompose';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import withStyles from '../../hoc/withStyles';
import withClickAway from '../../hoc/withClickAway';
import withPostMedia from '../../hoc/withPostMedia';
import withPostEditor from '../../hoc/withPostEditor';
import withHttp from '../../hoc/withHttp';
import IconActionButton from '../IconActionButton';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import httpGetHeaders from '../../util/httpGetHeaders';
import wpUrl from '../../util/wpUrl';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Image from '../Image';

const mediaPerPage = 10;

class PostMediaBody extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            searchKeyword: "",
            mediaFiles: [],
            values: [],
        };

        this.mediaTotalPages = 1;
        this.mediaPage = 1;

        this.httpMedia();
    }

    httpMedia(options){

        const {http} = this.props;
        const url = wpUrl().path('media').query({
            order: 'desc',
            orderBy: 'id',
            media_type: 'image',
            page: this.mediaPage++,
            per_page: mediaPerPage,
        }).url;

        var _self = this;

        http('_media', {
            url,
            method: 'GET',
            onSuccess: (response) => {
                const headers = httpGetHeaders({response});
                const body = httpNormalizeResponseBody({response});

                if(!body) return;

                _self.mediaTotalPages = parseInt(headers['x-wp-totalpages'], 10);
                _self.setState({mediaFiles: [..._self.state.mediaFiles, ...body]});
            }
        });
    }

    render(){

        const {cssStyles, insertImageToPostEditor} = this.props;
        const {mediaFiles} = this.state;    

        if(0 >= mediaFiles.length)
            return null;

        return (<div style={{width: 350, paddingBottom: 100}}><GridList cellHeight={120} cols={2}>
          {mediaFiles.map( (file, i) => {

            const {width: imageWidth, height: imageHeight} = file.media_details;

            const height = (imageHeight > imageWidth) ? 120 : (imageHeight*175)/imageWidth;
            const paddingTop = height >= 120 ? 0 : (120 - height)/2;

            return (
              <GridListTile
                 key={i}
                 cols={1}
                 classes={{root: cssStyles.mediaGridListTileImgFullWidth}}
                 style={{position: 'relative'}}
              >

               <Image
                  src={file.source_url}
                  alt={file.title.rendered}
                  style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', height, paddingTop}}
               />

                <GridListTileBar
                  style={{height: 42, }}
                  title={<span style={{fontSize: '0.5rem'}}>{file.title.rendered}</span>}
                  actionIcon={
                      <IconActionButton type='add' onClick={e => insertImageToPostEditor({
                        src: file.source_url
                      })} style={{color: '#F6F6F6'}}/>
                  }
                />
            </GridListTile>);
          })}
       </GridList>

       {this.mediaTotalPages >= this.mediaPage && (
         <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
           <IconActionButton
             type='KeyboardArrowDown'
             onClick={this.httpMedia.bind(this)} />
         </div>
       )}


       </div>)
    }

}

PostMediaBody = compose(
    withStyles,
    withHttp(),
    withPostEditor(),
)(PostMediaBody);

class PostMedia extends React.Component {

    componentWillMount(){

        const {setClickAway, closePostMedia} = this.props;

        setClickAway({
            onClickAway: closePostMedia,
        }); 
    }

    render(){

        const {cssStyles, 
               isPostMediaOpen,
               setClickAway, 
               closePostMedia} = this.props;

        if(!isPostMediaOpen())
            return null;

        return ( 
        <div
          ref={ref => setClickAway({ref})}
          style={{display: 'flex', width: '100%', height: 1, justifyContent: 'flex-end'}} 
        >
          <Drawer
              classes={{paper: cssStyles.drawerPaperPost,}}
              anchor='right'
              variant="persistent"
              onClose={closePostMedia}
              open={isPostMediaOpen()}>

            <div style={{paddingRight: 5, paddingTop: 5, paddingBottom: 10, backgroundColor: '#eeeeee'}}>
              <Typography style={{float: 'left', padding: '20px 0 0 20px', fontWeight: 600, fontSize: '1rem'}}>
                  Media Files
              </Typography>
              <span style={{float: 'right'}}>
                <IconActionButton type='clear' onClick={closePostMedia} />
              </span>
            </div>

            <PostMediaBody />
          </Drawer></div>);
    }
}

export default compose(
    withStyles,
    withClickAway({key: '_postmedia'}),
    withPostMedia(),
//    withHttp(),
)(PostMedia);



