import React from 'react';
import {Typography,AppBar} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';




// Get all the components

import VideoPlayer  from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';

// makestyles return a hook and classes for different components

const useStyles = makeStyles((theme) => ({
    appBar: {
      borderRadius: 15,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      border: '2px solid black',
    //  below xs it will have 90% Width
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
    
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));


const App=()=>{
    const classes=useStyles();
    return (
        <div className={classes.wrapper}>
            <AppBar position="static" color="red" className={classes.appBar}>
                <Typography variant="h3" align="center">
                        Gugle Meet
                </Typography>
            </AppBar>
            <VideoPlayer/>
            <Options>
                <Notifications/>
            </Options>

        </div>
    );


};


export default App;