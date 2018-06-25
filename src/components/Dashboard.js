import React from 'react';
import {compose} from 'recompose';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';  
import CardContent from '@material-ui/core/CardContent'; 
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import withStyles from '../hoc/withStyles';

class DashboardCard extends React.Component{

    render(){

        const {cssStyles, style: _style = {}, label, children, loading = true} = this.props;

        const style= Object.assign({}, {marginBottom: 10, width: '100%'}, _style);

        const cardContent = (
        <CardContent
          classes={{
              root: cssStyles.dashboardCardContent,
          }}>
        {children}
        </CardContent>);

        const cardContentLoading = (
        <div style={{background: 'rgba(0,0,0,0.3)', position: 'relative'}} >
          <CircularProgress style={{color: 'antiquewhite', position: 'absolute', left: '50%', top: '50%'}}/>
          {cardContent}
        </div>);

        return (
          <Card style={style}>
            <CardHeader
              classes={{
                  title: cssStyles.dashboardCardheaderTitle,  
                  root: cssStyles.dashboardCardheaderRoot,
              }}
              title={label}
            />
            {loading ? cardContentLoading : cardContent}
{/*            
<div style={{background: 'rgba(0,0,0,0.3)', position: 'relative'}} >
<CircularProgress style={{color: 'antiquewhite', position: 'absolute', left: '50%', top: '50%'}}/>
            <CardContent
              classes={{
                  root: cssStyles.dashboardCardContent,
              }}
            >
            {children}
            </CardContent>
</div>
*/}
          </Card>);
    }
}

DashboardCard = compose(
    withStyles,
)(DashboardCard);

const StyledLink = styled(Link)`
  color: #0073aa;
  text-decoration: none;
  &:hover{
    color: #00a0d2
  } 
`

const DashboardLink = props => {
    const {children, enable = true, ...rest} = props;
    return enable ? <StyledLink {...rest}>{props.children}</StyledLink> : props.children;
   
}

export {DashboardCard, DashboardLink};

