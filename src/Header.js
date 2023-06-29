import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { styled } from "@mui/material/styles";

import { createMockFormSubmission } from './service/mockServer';

const Alert = styled(MuiAlert)(() => ({
  backgroundColor: '#000',
  color: '#fff',

  '> .MuiAlert-icon': {
    display: 'none',
  },

  '> .MuiAlert-action': {
    alignItems: 'center', 

    '> button:first-of-type': {
      color: '#33FFF0',
      margin: '0 20px',
    },

    '> button:disabled': {
      color: '#ddd',
      margin: '0 20px',
    }
  },

  '> .MuiAlert-message > p': {
    margin: '5px 0',
  }
}));

const NameContainer = styled('p')(() => ({
  display: 'flex',
  gap: '10px'
}));

export default function Header(props) {
  const {data, ...rest} = props;

  const handleToastClose = () => {
    rest.setShowToast(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={rest.onClickLikeButton} disabled={rest.disableLikeButton}>
        LIKE
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleToastClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{marginRight: 2}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
          <Snackbar
            open={rest.showToast}
            onClose={handleToastClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleToastClose} sx={{ width: '100%' }} action={action}>
              <NameContainer>
                  <span>{data?.data?.firstName}</span>
                  <span>{data?.data?.lastName}</span>
              </NameContainer>
              <p>
                {data?.data?.email}
              </p>
            </Alert>
          </Snackbar>
          </Typography> 
          <Button
            variant="contained"
            size="small"
            color="secondary"
            disabled={rest.showToast}
            onClick={() => createMockFormSubmission()}
          >
            New Submission
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
