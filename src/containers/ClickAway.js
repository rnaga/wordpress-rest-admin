import React from 'react';
import ReactDOM from 'react-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

class ClickAway extends React.Component{

    componentDidMount(){
        document.addEventListener('click', this.handleClickAway.bind(this), true);
    }

    handleClickAway = (e) => {

        const {clickaway} = this.props;

        if(0 >= Object.entries(clickaway).length)
            return;

        Object.entries(clickaway).forEach( entry => {

//            const [key, value] = entry;
            const value = entry[1];

            if(!value) return;

            const {refs, onClickAway} = value;

            if(typeof onClickAway !== 'function')
                return;

            var isRef = false;

            for(let i in refs){

                let domNode = ReactDOM.findDOMNode(refs[i]);

                if(domNode && domNode.contains(e.target)){
                    isRef = true; break;
                }
            }

            !isRef && onClickAway();

        });

    }

    render = () => null;
}

const mapStateToProps = (state, ownProps) => ({
    clickaway: state.clickaway,
})

export default compose(
    connect(mapStateToProps),
)(ClickAway);

