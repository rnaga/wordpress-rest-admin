import React from 'react';
import {compose} from 'recompose';
import withStyles from '../../hoc/withStyles';
import withWidth from '../../hoc/withWidth';
import AtAGlance from '../../components/dashboard/AtAGlance';
import QuickDraft from '../../components/dashboard/QuickDraft';
import Activity from '../../components/dashboard/Activity';
import caches from '../../util/caches';

class Index extends React.Component{

    widthOthers(){

        return (<div style={{paddingTop: 50, display: 'flex'}}>
          <div style={{width: '50%', marginRight: '1%'}}>
            <AtAGlance />
            <Activity />            
          </div>

          <div style={{width: '49%'}}>
            <QuickDraft />
          </div>
        </div>)
    }

    widthXs(){

        return (<div style={{paddingTop: 50, display: 'flex', flexWrap: 'wrap'}}>
          <AtAGlance />
          <Activity />  
          <QuickDraft isCapableOf={['edit_posts']} />
        </div>) 
    }

    render(){
        const account = caches('account');
        const {width} = this.props;
        return width === 'xs' || !account.cap.edit_posts ? this.widthXs() : this.widthOthers();
    }
}

export default compose(
    withStyles,
    withWidth(),
)(Index);

