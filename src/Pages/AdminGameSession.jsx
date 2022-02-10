/* eslint-disable */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as Router from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'


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
  reactPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
  }
}));

export default () => {

  var str = window.location.href;
  var ids = str.split('/admin/')[1];
  var quizID = ids.split('/')[0];
  var sessID = ids.split('/')[1];

  const classes = useStyles();
  const [questionData, setQuestionData] = React.useState(null);
  const [startedStatus, setStartedStatus] = React.useState(true);
  const [seconds, setSeconds] = React.useState(0);
  const [question, setQuestion] = React.useState('');
  const [error, setErrorName] = React.useState('');
  const [position, setPosition] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [advanceButton, setAdvButton] = React.useState(false);

  const handleOpenDialog = () => {
    setAdvButton(false); // when user is prompt to advance
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAfterFinished = () => {
    handleClose();
    localStorage.setItem('prevSession', sessID);
  }

  const handleOpenWarning = () => {
    setOpenWarning(true);
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
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
  // if(questionData){
  //   var errormsg = [answerA, answerB, answerC, answerD, answerE, answerF].filter((v) => v).length !== questionData.correctOption.length;
  // }else{
  //   var errormsg = false;
  // }


  const getRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const postRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  
  function getStartedStatus() {
    fetch(`${url}admin/session/${sessID}/status`, getRequest)
    .then((r) => r.json())
    .then((r) => {
      
      //once click is detected, set the status, questions & the stage
      if(r.results.active){
        setErrorName('This session is active!');
        
        if(questionData == null){
          setQuestionData(r.results.questions);
          
        }
        
        if(position != r.results.position){
          setPosition(r.results.position);
        }

      }else{

        setErrorName('This session is not yet active!');
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
  let timeout = null; 
  let interval = null;

  useEffect(() => {
    
    console.log('useEffect again!');

    if(position != -1 && (position+1) <= questionData.length){

      console.log('before ' + questionData[position].eachQsTime);

      timeout = setTimeout(() => {
        setErrorName('Time is up!');        
        // advanceRequest(); instead of calling advance auto, prompt user to advance
        if((position+1) == questionData.length){
          handleClickOpen();  // end of quiz reminder        
        }else{
          handleOpenDialog(); // use dialog to remind admin to advance
          
          clearTimeout(timeout);
        }
      }, questionData[position].eachQsTime*1000);

      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);

    }else{
      if(position != -1 && position == questionData.length){ 
        //marks the end of the quiz
        setPosition(-1); 
        handleClickOpen();
        advanceRequest();
      }
      clearInterval(interval)
      clearTimeout(timeout);
    }
    return () => {
      if(questionData != null && position != -1 && (position+1) <= questionData.length){
        console.log('after ' + questionData[position].eachQsTime + ' sec');
        // advanceRequest();
      }
      ('in clean up!')
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [position, questionData]); 

  function advanceRequest(){
    
    console.log('hey')
    fetch(`${url}admin/quiz/${quizID}/advance`, postRequest)
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
      if(!r.error){
        setPosition(r.stage);
        setAdvButton(true); // when there is a new question received
        setErrorName('Quiz Timer Countdown starts for question ' + (r.stage+1));       
      }else{
        setErrorName(r.error);
      }
     
    })
    .catch((e) => {
      console.log(e);
    });
  }

  // before user click advance, keep polling to detect when advance is clicked
  if(questionData == null && position == -1){
    setTimeout(() => {
      getStartedStatus(); //useEffect will be triggered a few times due to async setStates
    }, 1000);
  }else{
    console.log(questionData);
    console.log(position);
  }
  
  window.onbeforeunload = function() {
    console.log('refresh detected');
    handleOpenWarning();
    return "Refresh detected!"
  }

  function callAdv() {
    clearTimeout(timeout);
    handleCloseDialog();
    advanceRequest();
  }

  return (
    
      <Container className={classes.paper} component="main" maxWidth="lg">
        <CssBaseline />
              <div className={classes.heroContent}>
                <Container maxWidth="sm">
                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    BIG BRAIN
                  </Typography>
                  <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    <Box fontWeight="fontWeightBold">Welcome to BIG BRAIN</Box> 
                    Delivering engaging learning to billions and all ages.
                  </Typography>
                  <div className={classes.heroButtons}>
                    <Grid container spacing={2} justify="center">
                      <Grid item>
                        <Button variant="contained" color="primary" onClick={callAdv} disabled={advanceButton}>
                          Advance the quiz!
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="app">
                    <div className="time">
                      {seconds}s
                    </div>
                  </div>
                  { (error !== '')
                  ? (<Alert severity="error"><Box fontWeight="fontWeightBold"> {error}</Box></Alert>)
                  : (null)}						
                </Container>
              </div>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"End of Quiz"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This quiz has ended! Please confirm to redirect back to dashboard.
                    End the quiz at dashboard to view the results!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAfterFinished} component={Router.Link} to={"/admin/dashboard"} color="primary" autoFocus>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Advance to Next Question"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Timer's Up! Feel free to advance to the next question.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={callAdv} color="primary" autoFocus>
                    Advance
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openWarning}
                onClose={handleCloseWarning}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Warning: A page refresh will reset the timer
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseWarning} color="primary" autoFocus>
                    I understand
                  </Button>
                </DialogActions>
              </Dialog>

              { position != -1 && questionData[position] ? (      
                    <Container maxWidth="xlnD">
                          <Typography variant="h5" align="center" color="textSecondary" paragraph>
                              <Box fontWeight="fontWeightBold">
                                  Time Limit: {questionData[position].eachQsTime}
                              </Box> 
                              <Box fontWeight="fontWeightBold">
                                  Mark: {questionData[position].eachQsMark}
                              </Box> 
                          </Typography>   
                        { questionData[position].picUpload != '' ? (<Card className={classes.root}>
                                                                      <CardMedia component='img' src={questionData[position].picUpload} />
                                                                    </Card>)
                                                                 : (null)
                        }        
                        { questionData[position].videoUrl != '' ? (<iframe 
                                                                    width="100%"
                                                                    height="315" 
                                                                    src={questionData[position].videoUrl}
                                                                    frameBorder="0" 
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                    allowFullScreen>
                                                                  </iframe>)
                                                                : (null)

                        }
                          
                          {console.log(questionData[position].videoUrl)}
                          <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            <Container className={classes.questionTitle} maxWidth="lg">
                              <Box fontWeight="fontWeightBold">{questionData[position].question}</Box> 
                            </Container>
                          </Typography>  

                          <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">Choose {questionData[position].correctOption.length} option:</FormLabel>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox checked={answerA} onChange={handleChange} name="answerA" />}
                                label={questionData[position].optionA}
                                disabled
                              />
                              <FormControlLabel
                                control={<Checkbox checked={answerB} onChange={handleChange} name="answerB" />}
                                label={questionData[position].optionB}
                                disabled
                              />
                              <FormControlLabel
                                control={<Checkbox checked={answerC} onChange={handleChange} name="answerC" />}
                                label={questionData[position].optionC}
                                disabled
                              />
                              <FormControlLabel
                                control={<Checkbox checked={answerD} onChange={handleChange} name="answerD" />}
                                label={questionData[position].optionD}
                                disabled
                              />
                              <FormControlLabel
                                control={<Checkbox checked={answerE} onChange={handleChange} name="answerE" />}
                                label={questionData[position].optionE}
                                disabled
                              />
                              <FormControlLabel
                                control={<Checkbox checked={answerF} onChange={handleChange} name="answerF" />}
                                label={questionData[position].optionF}
                                disabled
                              />
                            </FormGroup>

                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                            >
                            Confirm
                            </Button>
                          </FormControl>


                        </Container>
                        )
                      : (null)
                }
          </Container>    
    
  );
};

