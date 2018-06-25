import React from 'react';
import {compose} from 'recompose';
import ReactQuill from 'react-quill';
import withStyles from '../../hoc/withStyles';

import '../../styles/quill.snow.css';

class CommentField extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount(){

        const {input, defaultValue} = this.props;

        if(defaultValue && !input.value){
            input.onChange(defaultValue);
        }

        if(defaultValue || input.value){
            this.setState({
                text: input.value ? input.value : defaultValue
            });
        }
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleChange(value) {

        const {input, onInputChange} = this.props;

        this.setState({text: value});

        input.onChange(value);

        if(onInputChange)
            onInputChange(value, input);
    }

    render(){

        const {style: _style = {}} = this.props;

        const style = Object.assign({}, {width: '80%', height: 150, padding: '10px 0 50px 0'}, _style);

        return (<div >
          <ReactQuill style={style} value={this.state.text}
                  onChange={this.handleChange.bind(this)} />
        </div>)
    }
}


export default compose(withStyles)(CommentField);
