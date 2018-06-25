import React from 'react';
import {compose} from 'recompose';
import ReactQuill from 'react-quill';
import withStyles from '../hoc/withStyles';

import '../styles/quill.snow.css';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {

        const {onChange} = this.props;

        this.setState({text: value});

        if(onChange)
            onChange(value);
    }

    render(){

        const {style, ...rest} = this.props;

        return (
          <ReactQuill 
            style={style} 
            value={this.state.text}
            onChange={this.handleChange.bind(this)} 
            {...rest} />);
    }
}


export default compose(withStyles)(Comment);
