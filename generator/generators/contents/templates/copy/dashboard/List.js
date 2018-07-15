import React from 'react';
import {compose} from 'recompose';
import withStyles from 'wordpress-rest-admin/hoc/withStyles';
import withWidth from 'wordpress-rest-admin/hoc/withWidth';
import AtAGlance from 'wordpress-rest-admin/components/dashboard/AtAGlance';
import QuickDraft from 'wordpress-rest-admin/components/dashboard/QuickDraft';
import Activity from 'wordpress-rest-admin/components/dashboard/Activity';
import caches from 'wordpress-rest-admin/util/caches';

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

