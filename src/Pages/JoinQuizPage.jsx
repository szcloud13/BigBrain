import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

const url = 'http://localhost:5005/';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  widthControl: {
    width: '60%',
  },
  header: {
    margin: '5% 0',
  },
  submit: {
    width: '60%',
    margin: theme.spacing(3, 0, 2),
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const [sessionID, setSessionID] = React.useState(localStorage.getItem('sessionID'));
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSessionInput = (e) => {
    setSessionID(e.target.value);
  };

  const handleNameInput = (e) => {
    setName(e.target.value);
  };

  async function onSubmit() {
    if (name !== '' && sessionID !== '') {
      setError('');
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${name}`,
        }),
      };
      const response = await fetch(`${url}play/join/${sessionID}`, request);
      const json = await response.json();
      console.log(json, sessionID);
      if (json.playerId) {
        localStorage.setItem('playerID', json.playerId);
        console.log(json.playerId);
        history.push(`player/sessionID=${sessionID}/playerID=${json.playerId}`);
      } else {
        setError(json.error);
      }
    } else {
      setError('You have not filled out the form correctly!');
    }
  }

  return (
    <Container className={classes.paper} component="main" maxWidth="lg">
      <CssBaseline />
      <Typography className={classes.header} component="h2" variant="h2">
        Join An Existing Session!
      </Typography>
      <Typography component="h1" variant="h4">
        Enter the Session ID!
      </Typography>
      <TextField
        className={classes.widthControl}
        variant="outlined"
        margin="normal"
        required
        label="Session ID Input"
        value={sessionID}
        onChange={handleSessionInput}
        autoFocus
      />
      <Typography component="h1" variant="h4">
        Enter your Name!
      </Typography>
      <TextField
        className={classes.widthControl}
        variant="outlined"
        margin="normal"
        required
        label="Name Input"
        value={name}
        onChange={handleNameInput}
        autoFocus
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={onSubmit}
      >
        Join The Game!
      </Button>
      { (error !== '')
        ? (<Alert severity="error" className={classes.widthControl}>{error}</Alert>)
        : (null)}
    </Container>
  );
};
