/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from "react-player"
import * as Router from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox'
import Switch from '@material-ui/core/Switch';

const url = 'http://localhost:5005/';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  questionTitle: {
    width: '100%',
    flex: '30%',
    backgroundColor: 'blue',
    padding: '10%',
    color: 'white',
  },
  answersDiv: {
    flex: '70%',
    width: '100%',
    display: 'flex',
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  answerButton: {
    margin: '1%',
    padding: '5%',
    flex: '48%',
    height: '30%',
    backgroundColor: 'blue',
  },
  titleFont: {
    fontSize: '700',
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default () => {
  const classes = useStyles();
  
  const [correctAns, setCorrectAns] = React.useState(null);
  const [questionData, setQuestionData] = React.useState(null);
  const [startedStatus, setStartedStatus] = React.useState(false);
  const [hideOptions, setHideOptions] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [error, setErrorName] = React.useState('');
  const [dialog, setOpenDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [state, setState] = React.useState({
    answerA: false,
    answerB: false,
    answerC: false,
    answerD: false,
    answerE: false,
    answerF: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { answerA, answerB, answerC, answerD, answerE, answerF } = state;
  
  if(questionData){
    var errormsg = [answerA, answerB, answerC, answerD, answerE, answerF].filter((v) => v).length !== questionData.correctOption;
  }else{
    var errormsg = false;
  }

  const handleOpenWarning = () => {
    setOpenWarning(true);
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
  };


  
  var str = window.location.href;
  var ids = str.split('/player/')[1];
  var tmp1 = ids.split('/')[0];
  var tmp2 = ids.split('/')[1];
  var sessID = tmp1.split('sessionID=')[1];
  var playerID = tmp2.split('playerID=')[1];
  // console.log(sessID, playerID);

  const request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  function makeRequest(){

    var promise = new Promise(function(resolve, reject) {
      var ls = [];
      if(state.answerA){
        ls.push('A');
      } 
      if(state.answerB){
        ls.push('B');
      }
      if(state.answerC){
        ls.push('C');
      }
      if(state.answerD){
        ls.push('D');
      }
      if(state.answerE){
        ls.push('E');
      }
      
      if(state.answerF){
        ls.push('F');
      }
      console.log(ls);
      const request = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answerIds: ls,
        }),
      };
      console.log(request);
      resolve(request);
    });
  
    return promise;
  }

  async function getQuestionData() {
    // console.log('got here!')
    fetch(`${url}play/${playerID}/question`, request)
    .then((r) => r.json())
    .then((json) => {
      
      if(json.question){
        if(questionData && json.question.question != questionData.question){
          // console.log(json);
          // setCorrectAns(null);
          console.log('found new question!! setting qs data');
          setQuestionData(json.question); // only updates state iff question is different
          setActivePoll(false);
        }else if(questionData == null){
          // console.log(questionData);
          // setCorrectAns(null);
          console.log('questionData is null!! setting qs data');
          setQuestionData(json.question); // initial qs
          setActivePoll(false); 
        }
      }

      if(json.error){
        handleClickOpen();
        setErrorName(json.error);
      }
    })
    .catch((e) => {
      console.log(e);
      // setErrorName(e);
    });
  
  }

  async function getStartedStatus() {
    // console.log(playerID);
    fetch(`${url}play/${playerID}/status`, request)
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      if(!r.error){
        if(r.started != startedStatus){
          setStartedStatus(r.started);
        }
        if(r.started == true){
          setErrorName('Quiz begins!');
        }      
      }else{
        setErrorName(r.error);
        setOpenWarning();
      }
      
    })
    .catch((e) => {
      console.log(e);
    });
    
  }

  async function getCorrectAns(){
    console.log('getting ur ans!')
    fetch(`${url}play/${playerID}/answer`, request)
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      if(!r.error){
        if(r.answerIds){
          console.log(r.answerIds)
          setCorrectAns(r.answerIds);
        }
      }else{
        setErrorName(r.error);
      }
    })
    .catch((e) => {
      console.log(e);
    }); 
  }

  async function submitOption(){
    console.log('sending ur answers')
    if(!errormsg){ //if the number of options are 
      makeRequest()
      .then((request) => {
        console.log(request);
        return fetch(`${url}play/${playerID}/answer`, request);
      })
      .then((r) => {
        if(r.status == 200){
          console.log('response recorded!')
        }
      })
      .catch((e) => {
        console.log(e);
      });
    }else{
      setErrorName('More than ' + questionData.correctOption + 'options are chosen!');
    }
    
  }

  // polling for loading the first time
  React.useEffect(() => {
    let interval = null;
    let dataInterval = null;
    if(!startedStatus){
      console.log('polling')
      interval = setInterval(() => {
        getStartedStatus();
      }, 5000);
    }
    return () => {
      console.log('in status clean up')
      clearInterval(interval);
      getQuestionData();
    };
  }, [startedStatus]);

  React.useEffect(() => {
    console.log('timeout useeffect is called!')
    let timeout = null;
    if(questionData){
      toggle(); // start counting the seconds
      timeout = setTimeout(() => { 
        handleOpenDialog(); // tell user time is up
        reset(); // reset seconds & turn off counting
        getCorrectAns(); //show answers
        setActivePoll(true); //start polling for advance action
      }, questionData.eachQsTime*1000); // countdown time limit as well
    }else{
      console.log('in else')
      clearTimeout(timeout);
      reset();
    }

    return () => {
      if(questionData){
        console.log('in clean up')
        clearTimeout(timeout);
        reset();
        setCorrectAns(null);
      }
    };
  }, [questionData]);


  const [isActive, setIsActive] = React.useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  React.useEffect(() =>{
    let interval = null;
    if (isActive) {
      
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds])

  //getQuestion polling
  const [activePoll, setActivePoll] = React.useState(false);

  function togglePoll() {
    setActivePoll(!activePoll);
  }

  function resetPoll() {
    setActivePoll(false);
  }

  React.useEffect(() =>{
    let interval = null;
    if (activePoll) { //when active polls for new question
      console.log('Advance polling starts!');
      interval = setInterval(() => {
        getQuestionData(); 
      }, 1000);
    } else if (!activePoll) {
      console.log('Advance polling END!');
      clearInterval(interval);
    }
    return () => {
      console.log('Advance polling END!');
      clearInterval(interval);
    };
  }, [activePoll])



  function answers(){
    var ls = [];
    if(correctAns){
      if(Array.isArray(correctAns)){
        correctAns.map((opt, i) => {
          ls.push(<Box>{opt}</Box>);
        });
      }else{
        ls.push(<Box>{correctAns}</Box>);
  
      }
    }
    
    
    return ls;
  }

  window.onbeforeunload = function() {
    console.log('refresh detected');
    handleOpenWarning();
    return "Refresh detected!"
  }
  return (
    
      <Container className={classes.paper} component="main" maxWidth="lg">
        <CssBaseline />
        { (error !== '')
          ? (<Alert severity="error" className={classes.widthControl}>{error}</Alert>)
          : (null)}
        
        <Container maxWidth="xl">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            BIG BRAIN
          </Typography>

          <Dialog
            open={openWarning}
            onClose={handleCloseWarning}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Warning: A page refresh will make you lose all your progress
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseWarning} color="primary" autoFocus>
                I understand
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"End of Quiz"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This quiz has ended / not active! Agree to see your results!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} component={Router.Link} to={"/results/playerID="+playerID} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={dialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"End of Question"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Time's Up! Waiting on admin to bring you the next challenge...
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}  autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {startedStatus ? (<Typography variant="h5" align="center" color="textSecondary" paragraph>
                              <Box fontWeight="fontWeightBold">
                                  Timer: {seconds}s 
                              </Box> 
                          </Typography>)
                         : (<Typography variant="h5" align="center" color="textSecondary" paragraph>
                              <Box fontWeight="fontWeightBold">
                                  Waiting for quiz admin to start ...
                              </Box> 
                          </Typography>)
          }

          {
            questionData ? (<Typography variant="h5" align="center" color="textSecondary" paragraph>
                              <Box fontWeight="fontWeightBold">
                                  Time Limit: {questionData.eachQsTime}
                              </Box> 
                              <Box fontWeight="fontWeightBold">
                                  Mark: {questionData.eachQsMark}
                              </Box> 
                          </Typography>)
                         : (null)
          }

              
          {questionData ? (
            <Container maxWidth="xl">
            { questionData.picUpload != '' ? (<Card className={classes.root}>
                                                    <CardMedia component='img' src={questionData.picUpload} />
                                                  </Card>)
                                                : (null)
            } 
            { questionData.vidLink != '' ? (<iframe 
                                              width="100%"
                                              height="315" 
                                              src={questionData.vidLink}
                                              frameBorder="0" 
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                              allowFullScreen>
                                            </iframe>)
                                          : (null)

            }
              
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                <Container className={classes.questionTitle} maxWidth="lg">
                  <Box fontWeight="fontWeightBold">{questionData.question}</Box> 
                </Container>
              </Typography>
              
              { !correctAns ? (<FormControl required error={errormsg} component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Choose {questionData.correctOption} option:</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={answerA} onChange={handleChange} name="answerA" />}
                    label={questionData.optionA}
                    disabled={disabled}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={answerB} onChange={handleChange} name="answerB" />}
                    label={questionData.optionB}
                    disabled={disabled}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={answerC} onChange={handleChange} name="answerC" />}
                    label={questionData.optionC}
                    disabled={disabled}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={answerD} onChange={handleChange} name="answerD" />}
                    label={questionData.optionD}
                    disabled={disabled}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={answerE} onChange={handleChange} name="answerE" />}
                    label={questionData.optionE}
                    disabled={disabled}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={answerF} onChange={handleChange} name="answerF" />}
                    label={questionData.optionF}
                    disabled={disabled}
                  />
                </FormGroup>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={submitOption}
                >
                Confirm
                </Button>
              </FormControl>)
                          : (<Typography variant="h5" align="center" color="textSecondary" paragraph>
                              <Container className={classes.questionTitle} maxWidth="lg">
                              The answers are:
                              {answers()}                                
                              </Container>
                            </Typography>)
              }

              
          </Container>                
          )
          : (null)
        }
        </Container>  
      </Container>
    
  )
};