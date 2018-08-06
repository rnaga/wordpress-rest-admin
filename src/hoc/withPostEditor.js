import React from 'react';

const insertImageEventKey = '__eventPostEditInsertImage';
const eventInsertImageKey = '__eventPostEditInsertImage';

window[eventInsertImageKey] = window[eventInsertImageKey] || {

    addListner: listner => {
        window[eventInsertImageKey]._listner = listner;
    },

    removeListner: () => {
        window[eventInsertImageKey]._listner = null;
    },

    dispatch: args => {
        if(typeof window[eventInsertImageKey]._listner === 'function')
            window[eventInsertImageKey]._listner(args);
    }
}

const withPostEditor = () => (WrappedComponent) => {
    
    class Hoc extends React.Component{

        insertImageToPostEditor(detail){
            const _event = new CustomEvent(insertImageEventKey, {detail});
            document.dispatchEvent(_event);
        }

        render(){
            return (
                <WrappedComponent 
                  {...this.props}
                  insertImageEventKey={insertImageEventKey}
                  insertImageToPostEditor={this.insertImageToPostEditor.bind(this)}
                />
            )
        }
    }

    return Hoc;
}

export default withPostEditor;
