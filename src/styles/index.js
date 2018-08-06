
const styles = theme => {

  const headerMinHeight = 25;

  return {

    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: 'hidden',
      display: 'flex',
    },
  
    dashboardCardheaderTitle: {
      fontSize: '1.0rem !important',
      fontWeight: 'bold !important',
    },
  
    dashboardPostsCardheaderTitle: {
      fontSize: '0.8rem !important',
    },
  
    dashboardCardheaderRoot: {
      borderBottom: '1px solid #eee !important',
    },
  
    dashboardPostsCardheaderRoot: {
        paddingBottom: 0
    },
  
    dashboardCardContent: {
      fontSize: '0.8rem !important',
    },
  
    dashboardListItemText: {
      fontSize: '0.8rem !important',
    },
  
    dashboardActivityListItemTextPrimary: {
      fontSize: '0.8rem !important',
    },
  
    dashboardActivityListItemTextSecondary: {
      fontSize: '0.75rem !important',
    },
  
    dashboardQuickDraftTextFieldRoot: {
      borderRadius: 1,
      backgroundColor: 'inherit',
      border: '1px solid #ced4da',
    },
    
    deleteButton: {
      margin: theme.spacing.unit,
      backgroundColor: 'rgb(225, 0, 80)',
      zIndex: 1101,
    },
  
    saveButton: {
      margin: theme.spacing.unit,
      backgroundColor: '#2196f3',
      zIndex: 1101,
    },
  
    buttonRightIcon: {
      marginLeft: theme.spacing.unit,
    },
  
    button: {
      margin: theme.spacing.unit,
      width: 40,
      height: 40,
      transition: theme.transitions.create(['background-color']),
      '&:hover': {
        backgroundColor: '#DCDCDC',
      }
    },
  
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
  
    rightIcon: {
      marginLeft: theme.spacing.unit,
      boxShadow: 'none',
    },
  
    tableList: {
      width: '100%',
    },
  
    tableListPagenationInput: {
        fontSize: 12,
    },
  
    tabsRoot: {
      borderBottom: '1px solid #aaa', //#e8e8e8',
      backgroundColor: theme.palette.background.default,  
    },
  
    tabRoot: {
      textTransform: 'initial',
      minWidth: 40,
      minHeight: 20,
      '&:hover': {
        color: 'black',
        backgroundColor: '#dcdcdc',
        opacity: 1,
      },
  
    },
  
    tabSelected: {
      borderTop: '1px solid #aaa',
      borderLeft: '1px solid #aaa',
      borderRight: '1px solid #aaa',
    },
  
    tabsAppBar: {
      boxShadow: 'none',
      backgroundColor: '#222',
    },
  
    appBar: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#2C303B',
      boxShadow: 'none',
    },
  
    appBarPost: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#f5f5f5',
      boxShadow: 'none',
    },
  
    headerToolbar: {
      position: 'relative',
      paddingLeft: '6px',
      minHeight: `${headerMinHeight}px`,
    },
  
    headerAccountButton: {
      '&:hover': {
        backgroundColor: '#fff',
      }
    },
  
    drawerPaperXs: {
      backgroundColor: '#2C303B',
    },
  
    drawerPaper: {
      position: 'relative',
      overflow: 'auto',
      backgroundColor: '#2C303B',
      border: 0,
    },
  
    drawerPaperPost: {
      top: `${headerMinHeight*2}px !important`,
      overflowX: 'hidden',
      minWidth: 350,
    },
  
    drawerTooltip: {
      margin: '-10px 20px',
      position: 'absolute',   
    },
  
    userAccount: {
        zIndex: 1200,
        width: 5,
        position: 'absolute',
        top:  `${(headerMinHeight*2)-2}px`, 
        left: 60
    },
  
    postSettings: {
        flex: 1,
        width: '100%',
        top:  `${headerMinHeight*3}px`, 
    },
  
    drawerIcon: {
        margin: '5px 10px 5px 10px',
    },
  
    drawerMenu: {
      display: 'flex',
      alignItems: 'center',
    },
  
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      minWidth: 0, 
    },
  
    toolbar: {
      minHeight: 37,
    },
  
    listItem: {
      '&:hover': {
        backgroundColor: '#0073aa',
      }
    },
  
    listItemNoPadding: {
      padding: 0
    },
  
    listItemPadding: {
      paddingTop: 4,
      paddingBottom: 4,
    },
  
    listItemCurrent: {
      backgroundColor: '#0073aa',
      '&:hover': {
        backgroundColor: '#0073aa',
        opacity: '0.5'
      }
    },
  
    listItemIcon: {
      marginRight: '0px',
    },
  
    listItemText: {
      color: '#DCDCDC',
      fontSize: '0.9rem',
      letterSpacing: '1.5px',
      fontWeight: '500',
    },
  
    listSubMenu: {
      paddingLeft: theme.spacing.unit * 4,
    },
  
    accountSubHeader: {
      lineHeight: '0.1em', 
    },
  
    accountContentListTextItem: {
      fontSize: '0.8em',
    },
  
    contentTitle: {
      fontSize: '1.2rem',
      letterSpacing: 1,
      display: 'inline',
    },
  
    postsSearchForm: {
      float: 'right',
    },
  
    textFieldDefaultInput: {
      padding: '5px 6px !important',
      width: 'calc(100% - 24px)',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      }
    },
  
    textFieldDefaultRoot: {
      borderRadius: 1,
      backgroundColor: '#eeeeee', 
      border: '1px solid #ced4da',
    },
  
    textFieldDefaultInputLableRoot: {
      width: '200px',
    },
  
    titleFieldDefaultRoot: {
      fontSize: '1.8rem',
    },
  
    datetimeFieldDefaultInput: {
      fontSize: 14,
      padding: '5px 6px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      }
    },
  
    datetimeFieldDefaultRoot: {
      borderRadius: 1,
    },
  
    fullscreenDialogPaper: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  
    fullscreenColorPrimary: {
      color: 'antiquewhite',
    },
  
    snackBarRoot: {
      flexGrow: 0
    },
    
    snackBarButton: {
      width: theme.spacing.unit * 4,
      height: theme.spacing.unit * 4,
    },
  
    dialogPaperLg: {
        width: '50%',
    },
  
    dialogPaperMd: {
        width: '80%',
    },

    expandCollapseEntered: {
      overflow: 'unset !important',
    },
    
    expandPanelSummaryContent: {
      display: 'block !important'
    },

    mediaGridListTileImgFullWidth: {
      top: '50%',
      width: '',
      position: 'relative',
    },
  
    mediaPageRoot: {
        padding: '10px 10px 0 10px'
    }

}}

export default styles;
