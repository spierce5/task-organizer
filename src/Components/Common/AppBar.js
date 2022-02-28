import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function MenuAppBar({ user }) {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    sessionStorage.removeItem('User'); 
    sessionStorage.clear();
    //using navigate isn't clearing sessionStorage. Refreshing the page does, then navigates to Login since no token
    window.location.reload(false);
    //navigate('/login')
}

  return (
    <Box sx={{ flexGrow: 1, width: '100vw' }}>
      <AppBar position="static" sx={{backgroundColor: '#4C4646'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            My Tasks
          </Typography>
          {
            <div style={{position: 'absolute', right: 10}}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize='large'/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem   disableRipple={true}
                            divider={true} 
                            sx={{
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                     cursor: 'default'
                                     }}}
                >
                    {user}
                </MenuItem> 
                <MenuItem onClick={handleClose}>My Account</MenuItem>
                <MenuItem onClick={handleLogout} sx={{color:'red'}}>Logout</MenuItem>
              </Menu>
            </div>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
