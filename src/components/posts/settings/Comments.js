import React from 'react';
import {compose} from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withComment from '../../../hoc/contents/withComment';
import withHttp from '../../../hoc/withHttp';
import httpNormalizeResponseBody from '../../../util/httpNormalizeResponseBody';
import httpGetHeaders from '../../../util/httpGetHeaders';
import Comment from '../../../components/Comment';
import caches from '../../../util/caches';
import wpUrl from '../../../util/wpUrl';

class Comments extends React.Component {

    constructor(props){
        super(props);
        this.state = {open: false};
        this.comments = [];
        this.commentsCount = 0;
        this.addComment = '';
    }

    componentWillMount(){
        const {comment} = this.props;
        comment.bind(this);
        this.httpComment();
    }

    httpComment(){
        const {edit, http} = this.props;
        const _self = this;

        http('_comments', {
            url: wpUrl().path(`comments`).query({post: edit.id, per_page: 5, orderby: 'id', order: 'desc'}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: response => {
                const body = httpNormalizeResponseBody({response});
                const headers = httpGetHeaders({response});

                _self.comments = body;
                _self.commentsCount = parseInt(headers['x-wp-total'], 10);
            },
        });
    }

    handleClick(){

        const {edit} = this.props;
        const account = caches('account');
        const _account = account.get();

        const value = {
            post: edit.id,
            author: _account.id,
            author_email: _account.email,
            author_name: _account.nickname,
            content: this.addComment,
        };

        const _self = this;

        this.comment.handleSubmit(value, () => {
            _self.setState({open: false});
            _self.httpComment();
        }); 
  
    }

    render(){

        const comments = this.comments;
        const {open} = this.state;
     
        return (<div style={{width: 290}}>
        {0 >= comments.length && 
          <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 10, fontSize: '0.9rem'}}>No comments yet</div>
        }
        {0 < comments.length && comments.map( (comment, i) => {
            return (
              <div key={i} style={{
                width: '100%',
                backgroundColor: '#fafafa', 
                padding: 10, 
                borderBottom: '1px solid grey',
                display: 'inline-block',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                hyphens: 'auto',
                overflowY: 'auto',
              }}>
                <Typography component="p" style={{fontSize: '0.9rem', fontWeight: 600}}>
                  {comment.author_name}
                </Typography>
                <Typography component="p" style={{fontSize: '0.80rem', color: 'grey'}}>
                  {comment.date}
                </Typography>
                <Typography component="p" style={{fontSize: '0.9rem', paddingTop: 10}}>
                    {comment.content.rendered}
                </Typography>
              </div>
            );
        })}
        {5 < this.commentsCount &&
            <div style={{height: 20}}>
              <Typography component="p" style={{float: 'right', fontSize: '0.70rem', color: 'grey'}}>
                {(this.commentsCount - 5)} more comments
              </Typography>
            </div>
        }
        {!open &&
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <Button variant='flat' color='primary' size='small' onClick={() => this.setState({open: true})}>Add Comment</Button>
        </div>}
        {open && <div style={{width: 310}}>
          <Comment 
            style={{padding: '25px 0', height: 150}}
            onChange={v => {this.addComment = v;}} />
          <div style={{padding: '40px 0'}}> 
            <Button variant='flat' color='primary' size='small' onClick={this.handleClick.bind(this)}>Add Comment</Button>
            <Button variant='flat' color='secondary' size='small' onClick={() => this.setState({open: false})}>Cancel</Button>
          </div>
        </div>}
        </div>);
    }
}


export default compose(
    withComment({namespace: 'comment'}),
    withHttp(),
)(Comments);
