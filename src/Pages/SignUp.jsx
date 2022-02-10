/* eslint-disable */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

const url = 'http://localhost:5005/';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default () => {

  if(localStorage.getItem('token')){
    localStorage.removeItem('token');
  }

  const history = useHistory();
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    signupError: '',
  });

  const [error, setError] = useState('');
  const classes = useStyles();

  function onSignUp() {
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signUpForm.email,
        name: signUpForm.name,
        password: signUpForm.password,
      }),
    };

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
    } else {
      fetch(`${url}admin/auth/register`, request)
        .then((r) => r.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('statusMsg', 'Successfully signed up!');
          } else {
            setError(data.error);
          }
        })
        .then(() => {
          if (localStorage.getItem('token')) {
            history.push('/');
          }
        });
    }
  }

  const onTextboxChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prevSignUpForm) => ({
      ...prevSignUpForm,
      [name]: value,
    }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up As Admin
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={onTextboxChange}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Name"
            label="Name"
            name="name"
            onChange={onTextboxChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            onChange={onTextboxChange}
            id="password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="password-confirm"
            onChange={onTextboxChange}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSignUp}
          >
            Sign Up
          </Button>
          { (error !== '')
            ? (<Alert severity="error">{error}</Alert>)
            : (null)}

        </form>
      </div>
    </Container>
  );
};
