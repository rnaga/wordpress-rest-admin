import React from 'react';
import {compose} from 'recompose';
import withParent from '../hoc/withParent';

/*
 Sample Usage

<Condition>
<If cond={props => false}>
<div>condition if</div>
</If>
<ElseIf cond={props => false}>

</ElseIf>
<ElseIf cond={props => true}>
  <Condition>
    <If cond={props => true}>
      Output
    </If>
  </Condition>
</ElseIf>
<Else>
<div>condition else</div>
</Else>
</Condition>

*/

// State
const S_ERROR = 'ERROR';
const S_IF = 'IF';
const S_ELSE_ELSEIF = 'ELSE_ELSEIF';
const S_END = 'END';

// State Machine
const FSM = (state, elemType) => {

    switch(state){
        case S_IF:
            return elemType !== If ? S_ERROR : S_ELSE_ELSEIF;
        case S_ELSE_ELSEIF:
            if(elemType === Else)
                return S_END;
            if(elemType === ElseIf)
                return S_ELSE_ELSEIF;
            return S_ERROR;
        default:
            return S_ERROR;
    }
}

const IfElseIfElse = props => {
    if(!props._parent || props._parent.type !== Condition)
        throw new Error('If/ElseIf/If needs to be placed under Condition component');

    return props.children || null;
}

// Tokens
const If = props => IfElseIfElse(props);
const ElseIf = props => IfElseIfElse(props);
const Else = props => IfElseIfElse(props);

// Parser
class Condition extends React.Component {

    render(){
        const {children} = this.props;

        var state = S_IF;
        var output = null;
        var hasTrueCond = false;

        React.Children.forEach(children, (child,i) => {

            state = FSM(state, child.type);

            if(state === S_ERROR)
                throw new Error(`Condition parse error.`);

            if(hasTrueCond) return;

            if(child.type === If || child.type === ElseIf){

                if(typeof child.props.cond !== 'function')
                    throw new Error(`If or ElseIf element needs to pass cond. 
                        typeof cond = ${typeof child.props.cond}`);

                if( !child.props.cond(child.props) )
                    return;

            }
                
            output = child;
            hasTrueCond = true;
        });

        return output;
    }
}

export {If, Else, ElseIf}

export default compose(
    withParent,
)(Condition);
