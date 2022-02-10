/* eslint-disable */
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Router from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const url = 'http://localhost:5005/';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header() {
  const classes = useStyles();
  const history = useHistory();
  async function onLogOut() {
    const request = await {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    fetch(`${url}admin/auth/logout`, request)
      .then((r) => r.json())
      .then((data) => {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        if (data.error) {
          localStorage.setItem('statusMsg', data.error);
        } else {
          localStorage.setItem('statusMsg', 'Successfully logged out!');
        }
      })
      .then(() => {
        history.push('/');
        window.location.reload();
      })
      .catch((e) => console.log(e));
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Button style={{ fontSize: '20px' }} component={Router.Link} to="/admin/dashboard" color="inherit">Big Brain</Button>
        </Typography>
        {
          (!localStorage.getItem('token')) ? (
            <div>
              <Button component={Router.Link} to="/join" color="inherit">Join Session</Button>
              <Button component={Router.Link} to="/admin/signin" color="inherit">Login</Button>
              <Button component={Router.Link} to="/admin/signup" color="inherit">Sign Up</Button>
            </div>
          )
            : (<div>
                <Button component={Router.Link} to="/join" color="inherit">Join Session</Button>
                <Button component={Router.Link} to="/" color="inherit" onClick={onLogOut}>Log Out</Button>
              </div>)
        }

      </Toolbar>
    </AppBar>
  );
}

export default Header;
