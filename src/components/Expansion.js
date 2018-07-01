import React from 'react';
import {compose} from 'recompose';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import getIcon from '../util/getIcon';
import withStyles from '../hoc/withStyles';

class Expansion extends React.Component {

    render(){

        const {cssStyles, title, subTitle, children} = this.props;

        const ExpandMore = getIcon({iconName: 'ExpandMore'});

        return ( 
          <ExpansionPanel CollapseProps={{classes: {entered: cssStyles.expandCollapseEntered}}}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />} classes={{content: cssStyles.expandPanelSummaryContent}} >
              <Typography >{title}</Typography>
              {subTitle}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{display: 'block !important'}}>
              {children}
            </ExpansionPanelDetails>
          </ExpansionPanel>);
    }
}

export default compose(
    withStyles,
)(Expansion);

