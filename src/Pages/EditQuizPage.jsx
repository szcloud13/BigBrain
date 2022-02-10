/* eslint-disable */
import React from 'react';
import * as Router from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// import QuizQuestion from '../Components/QuizQuestion';

const url = 'http://localhost:5005/';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  containerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    marginRight: '5%',
    float: 'left',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: '5%',
    float: 'right',
  },
  questionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'wrap',
    justifyContent: 'space-around',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  typography: {
    margin: '4px 0',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default () => {

  var str = window.location.search;
  var quizID = str.split('?id=');

  const classes = useStyles();
  const [quizName, setQuizName] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const [newQs, setNewQs] = React.useState('');
  const [eachQsTime, setEachQsTime] = React.useState(30); // default 30 seconds answering time for each qs
  const [optionA, setOptionA] = React.useState('');
  const [optionB, setOptionB] = React.useState('');
  const [optionC, setOptionC] = React.useState('');
  const [optionD, setOptionD] = React.useState('');
  const [optionE, setOptionE] = React.useState('');
  const [optionF, setOptionF] = React.useState('');
  

  const [error, setErrorName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [correctOption, setCorrectOption] = React.useState(() => ['A', 'B']);

  const handleCorrectOption = (event, newCorrectOpt) => {
    setCorrectOption(newCorrectOpt);
  };

  const handleClickOpen = () => {
    setErrorName('');
    setOpen(true);
  };

  const handleClose = () => {
    setErrorName('');
    setOpen(false);
  };

  const onInputChange = (e) => {
    setErrorName('');
    setNewQs(e.target.value);
  };

  const onOptionAChange = (e) => {
    setOptionA(e.target.value);
  };

  const onOptionBChange = (e) => {
    setOptionB(e.target.value);
  };

  const onOptionCChange = (e) => {
    setOptionC(e.target.value);
  };

  const onOptionDChange = (e) => {
    setOptionD(e.target.value);
  };

  const onOptionEChange = (e) => {
    setOptionE(e.target.value);
  };

  const onOptionFChange = (e) => {
    setOptionF(e.target.value);
  };

  const onEachQsTimeChange = (e) => {
    if(e.target.value >= 10){
      setEachQsTime(e.target.value);
    }
  };
  
  const onNameChange = (e) => {
    setQuizName(e.target.value);
  };

  async function confirmEdit() {
    console.log(quizName);
    if(quizName != '' && quizName != ' '){
      makeRequestBody(questions)
      .then((request) => requestQuizUpdate(request)) // call backend
      .catch((e) =>{
        console.log(e);
      });
    }else{
      setErrorName('Quiz Name cannot be empty!');
    }
    
  }

  function confirmQs() {
    
    handleClose();
      //create a question object and store multiple choice + the correct choice
    var qs_obj = {
      question: newQs,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      optionE: optionE,
      optionF: optionF,
      correctOption: correctOption,
      eachQsTime: eachQsTime,
      eachQsMark: 10,
    }

    var promise = new Promise(function(resolve, reject) {
      // append the new qs to the prev qs array
      setQuestions(questions.concat(qs_obj));
      resolve(questions.concat(qs_obj));
    });
  
    return promise;
    
  }
  
  function removeQs(index) {
    var promise = new Promise(function(resolve, reject) {
      // remove the qs from current qs array
      setQuestions(questions.splice(index, 1));
      resolve(questions);
    });
  
    return promise;
  }

  function makeRequestBody(QsArray){
    var promise = new Promise(function(resolve, reject) {
      // remove the qs from current qs array
      console.log(localStorage.getItem('token'));
      console.log(QsArray);
      const request = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          questions: QsArray,
          name: quizName,
        }),
      };
      
      resolve(request);
    });
  
    return promise;
  }

  function updateQs(index){
    
    if(index < 0){ // if we are adding Qs
      if(optionA == '' || optionB == '' || optionC == '' || optionD == '' || optionE == '' || optionF == '' || newQs == ''){
        handleClose();
        setErrorName('The question & its multiple choices cannot be empty!');
      }else{
        confirmQs()
        .then((QsArray) => {
          console.log(QsArray);
          return makeRequestBody(QsArray);
        })
        .then((request) => {
          console.log(request);
          requestQuizUpdate(request);
        }) // call backend 
        .catch((e) =>{
          console.log(e);
        });
      }

    }else{ // if we are removing Qs
      removeQs(index)
      .then((removedArray) => {
        console.log(removedArray);
        return makeRequestBody(removedArray);
      })
      .then((request) => requestQuizUpdate(request)) // call backend
      .catch((e) =>{
        console.log(e);
      })
    }
    
  }
  

  async function requestQuizUpdate(request) {
    console.log(questions);
    try{
      const response1 = await fetch(`${url}admin/quiz/${quizID[1]}`, request);
      const resp = await response1.json();
      console.log(resp);
      if (response1.status === 200) {
        fetchData();
        setErrorName('Your request was successful!');
        console.log('success');
      }else{
        console.log(response1.status);
      }
    }catch (e) {
      console.log(e);
    }
      
  }

  async function fetchData() {
    console.log('getting questions....');
    console.log(window.location.search.split('?id='));
    
    
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz/${quizID[1]}`, request)
    .then((r) => r.json())
    .then((r) =>{
      console.log(r);
      setQuestions(r.questions);
    })
    .catch ((e) =>{
      setErrorName(e);
    });
  }

  function showOptions(row) {
    var ls = [];
    console.log(Array.isArray(row.correctOption));
    if(Array.isArray(row.correctOption)){
      row.correctOption.map((opt, i) => {
        ls.push(<Box>{opt}</Box>);
      });
    }else{
      ls.push(<Box>{row.correctOption}</Box>);
      console.log(row);
    }
    
    return ls;
  }

  React.useEffect(() => {
    fetchData();    
  }, []);

  return (
    <Container component="main" maxWidth="xl" className={classes.paper}>
      <CssBaseline />
      
      <Avatar className={classes.green}>
        <AssignmentIcon />
      </Avatar>
      
      <Typography className={classes.typography} component="h1" variant="h4">
        Edit your quiz name
      </Typography>
      
      <Container component="div" className={classes.containerWrapper}>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="Quiz"
              label="Change Quiz Name (optional)"
              name="Quiz name"
              autoComplete="quizName"
              autoFocus
              onChange={onNameChange}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={confirmEdit}
            >
              Submit Edits
            </Button>
            </form>
      </Container>
      { (error !== '')
          ? (<Alert severity="error">{error}</Alert>)
          : (null)}
      <Container component="main" maxWidth="xl" className={classes.paper}>
        <Avatar className={classes.green}>
          <AssignmentIcon />
        </Avatar>
        <Typography className={classes.typography} component="h1" variant="h4">
          Questions
        </Typography>
        <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell>Correct Option</TableCell>
                  <TableCell>Time (In seconds)</TableCell>
                  <TableCell>Question Mark</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              {questions.length > 0
                ? (
                  <TableBody>
                    {questions.map((row, id) => (
                      <TableRow key={id}>
                        <TableCell>{row.question}</TableCell>
                        <TableCell>
                          <List>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">A: </Box>{row.optionA}
                            </ListItem>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">B: </Box>{row.optionB}
                            </ListItem>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">C: </Box>{row.optionC}
                            </ListItem>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">D: </Box>{row.optionD}
                            </ListItem>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">E: </Box>{row.optionE}
                            </ListItem>
                            <ListItem>
                              <Box fontWeight="fontWeightBold">F: </Box>{row.optionF}
                            </ListItem>
                          </List>
                        </TableCell>

                        <TableCell>
                          {showOptions(row)}
                        </TableCell>

                        <TableCell>{row.eachQsTime}</TableCell>
                        <TableCell>{
                          row.eachQsMark ? (row.eachQsMark)
                                         : (10)
                        }</TableCell>
                        <TableCell>
                          {console.log(quizID)}
                          <Button component={Router.Link} to={`/admin/edit/quizid?${quizID[1]}/question?${id}`} variant="contained" size="small" color="primary"  variant="contained">Edit</Button>
                        </TableCell>
                        <TableCell align="right">
                          <Button onClick={() => updateQs(id)} variant="contained">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )
                : (null)
              }
              
            </Table>
            <div className={classes.seeMore}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleClickOpen}
              >
                Add a question
              </Button>
            </div>
      </Container>
            
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={false} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box fontWeight="fontWeightBold">Challenge with a new question and answer options!</Box> 
            * Each Question time and worth defaults to 30 seconds and 10 marks. Explore more through the Edit Button!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="Question"
            label="A challenging question"
            type="text"
            fullWidth
            onChange={onInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="optionA"
            label="A convincing option A"
            type="text"
            fullWidth
            onChange={onOptionAChange}
          />
          
          <TextField
            autoFocus
            margin="dense"
            id="optionB"
            label="A convincing option B"
            type="text"
            fullWidth
            onChange={onOptionBChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="optionC"
            label="A convincing option C"
            type="text"
            fullWidth
            onChange={onOptionCChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="optionD"
            label="A convincing option D"
            type="text"
            fullWidth
            onChange={onOptionDChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="optionE"
            label="A convincing option E"
            type="text"
            fullWidth
            onChange={onOptionEChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="optionF"
            label="A convincing option F"
            type="text"
            fullWidth
            onChange={onOptionFChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="optionF"
            label="A worthy thinking time for this question (seconds)"
            type="text"
            fullWidth
            onChange={onEachQsTimeChange}
          />

        </DialogContent>
        <DialogActions>
          <Typography>
            <Box color="red">* Pick the correct options</Box>
          </Typography>
          <ToggleButtonGroup
            value={correctOption}
            onChange={handleCorrectOption}
            aria-label="correct answer for the question"
          >
            <ToggleButton value="A" aria-label="A">
              A
            </ToggleButton>
            <ToggleButton value="B" aria-label="B">
              B
            </ToggleButton>
            <ToggleButton value="C" aria-label="C">
              C
            </ToggleButton>
            <ToggleButton value="D" aria-label="D">
              D
            </ToggleButton>
            <ToggleButton value="E" aria-label="E">
              E
            </ToggleButton>
            <ToggleButton value="F" aria-label="F">
              F
            </ToggleButton>
          </ToggleButtonGroup>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button onClick={() => updateQs(-1)} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
            

            
          
    </Container>
  );
};
