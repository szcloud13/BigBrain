/* eslint-disable*/
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Videocam from '@material-ui/icons/Videocam';


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
	formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default () => {
	const classes = useStyles();
	const [quiz, setQuiz] = React.useState({});
	const [questions, setQuestions] = React.useState([]);
	const [newQs, setNewQs] = React.useState('');
  const [eachQsTime, setEachQsTime] = React.useState(30); // default 30 seconds answering time for each qs
  const [optionA, setOptionA] = React.useState('');
  const [optionB, setOptionB] = React.useState('');
  const [optionC, setOptionC] = React.useState('');
  const [optionD, setOptionD] = React.useState('');
  const [optionE, setOptionE] = React.useState('');
	const [optionF, setOptionF] = React.useState('');
	const [eachQsMark, setEachQsMark] = React.useState(10);
	const [error, setErrorName] = React.useState('');
	const [state, setState] = React.useState(false); // for switch option between single/multiple choice
  const [picState, setPicState] = React.useState([]);
	const [videoLink, setVidLink] = React.useState('');
	const [correctOption, setCorrectOption] = React.useState(() => ['A', 'B']);

  const handleCorrectOption = (event, newCorrectOpt) => {
    setCorrectOption(newCorrectOpt);
  };

	const onInputChange = (e) => {
    setErrorName('');
    setNewQs(e.target.value);
	};
	
  const handleTimeChange = (event) => {
    setEachQsTime(event.target.value);
	};
	
	const handleMarkChange = (event) => {
    setEachQsMark(event.target.value);
	};
	
  const handleChange = (event) => {
		setState(event.target.checked);
		if(event.target.checked){
			setCorrectOption('A'); //change type of correctOption
		}else{
			console.log('false!')
			setCorrectOption(['A', 'B']); //change type of correctOption
		}
		
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
	
	const onVidLinkChange = (e) => {
    setVidLink(e.target.value);
  };

	
	const handleCapture = ({ target }) => {
		const fileReader = new FileReader();
		const name = target.accept.includes('image') ? 'images' : 'videos';

		if(target.files[0]){
			fileReader.readAsDataURL(target.files[0]);
			fileReader.onload = (e) => {
				setPicState(e.target.result);
			};
		}
		
	};

	var str = window.location.search;
	var first = str.split('?');
	var s = first[1].split('/question');
	var quizID = s[0];
	var qsID = first[2];


	async function fetchData() {
    console.log('getting questions....');
    console.log(quizID, qsID);
    
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz/${quizID}`, request)
    .then((r) => r.json())
    .then((r) =>{
			console.log(r);
			setQuiz(r);
			setQuestions(r.questions);
		})
    .catch ((e) =>{
      setErrorName(e);
    });
	}

	async function confirmQs() {
		//create a question object and store multiple choice + the correct choice

		if(!Array.isArray(correctOption)){
			var optionArray = [correctOption];
		}else{
			var optionArray = correctOption;
		}

		var qs_obj = await {
      question: newQs,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      optionE: optionE,
      optionF: optionF,
      correctOption: optionArray,
      eachQsTime: eachQsTime,
			eachQsMark: eachQsMark,
			videoUrl: videoLink,
			picUpload: picState,

		}

    var promise = new Promise(function(resolve, reject) {
			// append the new qs to the prev qs array
			console.log(qs_obj)
			let oldQsArray = [...questions];
			oldQsArray[qsID] = qs_obj;
      setQuestions(oldQsArray);
      resolve(oldQsArray);
    });
  
    return promise;
    
	}

	function makeRequestBody(QsArray){
    var promise = new Promise(function(resolve, reject) {
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
          name: quiz.name,
        }),
      };
      
      resolve(request);
    });
  
    return promise;
	}
	
	function updateQs(){
		if(optionA == '' || optionB == '' || newQs == ''){
			setErrorName('The question title cannot be empty. Minimum 2 option must be provided.');
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
	}
	
	async function requestQuizUpdate(request) {
    console.log(questions);
    try{
      const response1 = await fetch(`${url}admin/quiz/${quizID}`, request);
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
	
	function setAllStates() {

		if(questions.length > 0){
			console.log('oh hey!');
			console.log(questions[qsID]);

			setOptionA(questions[qsID].optionA);
			setOptionB(questions[qsID].optionB);
			setOptionC(questions[qsID].optionC);
			setOptionD(questions[qsID].optionD);
			setOptionE(questions[qsID].optionE);
			setOptionF(questions[qsID].optionF);

			console.log(questions[qsID].correctOption.length)
			if(questions[qsID].correctOption.length == 1){
				setState(true);
				setCorrectOption(questions[qsID].correctOption[0])
			}else{
				setState(false);
				setCorrectOption(questions[qsID].correctOption);
			}

			setEachQsTime(questions[qsID].eachQsTime);
			setEachQsMark(questions[qsID].eachQsMark);
			setNewQs(questions[qsID].question);

			if(questions[qsID].videoUrl){
				setVidLink(questions[qsID].videoUrl);	
			}
			if(questions[qsID].picUpload){
				setPicState(questions[qsID].picUpload);
			}
		}

	}

  React.useEffect(() => {
		fetchData();
	}, []);

	React.useEffect(() => {
		setAllStates();
	}, [questions]);


  const help = 'This should be the page where we edit questions';
  return (
    <React.Fragment>
        <CssBaseline/>
				

        <Container component="main" maxWidth="xs">
					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<EditIcon />
						</Avatar>
						{ quiz != {}
							? (<Typography component="h1" variant="h4" align="center">
									Edit your Question for <Box fontWeight="fontWeightBold">"{quiz.name}"</Box> 
								</Typography>)
							: (null)
						}

						{ questions.length > 0
							? (<Typography component="h1" variant="h6" align="center">
									<Box marginTop="10px" fontWeight="fontWeightBold" fontStyle="italic">'{questions[qsID].question}?'</Box> 
								</Typography>)
							: (null)
						}
						<FormControl className={classes.formControl}>
							<InputLabel id="demo-simple-select-label">Mark for this Question</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={eachQsMark}
								onChange={handleMarkChange}
							>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={20}>20</MenuItem>
								<MenuItem value={30}>30</MenuItem>
								<MenuItem value={40}>40</MenuItem>
								<MenuItem value={50}>50</MenuItem>
							</Select>
						</FormControl>

							<FormControl className={classes.formControl}>
								<InputLabel id="demo-simple-select-label">Thinking time for this Question (seconds)</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={eachQsTime}
									onChange={handleTimeChange}
								>
									<MenuItem value={5}>5</MenuItem>
									<MenuItem value={10}>10</MenuItem>
									<MenuItem value={15}>15</MenuItem>
									<MenuItem value={20}>20</MenuItem>
									<MenuItem value={25}>25</MenuItem>
									
								</Select>
							</FormControl>
							
							<FormControlLabel
								control={
									<Switch
										checked={state}
										onChange={handleChange}
										name="checkedA"
										inputProps={{ 'aria-label': 'secondary checkbox' }}
									/>
								}
								label="Is this a Single Choice Question?"
								required={true}
							/>
							
							<Typography>
								<Box color="red">* Pick the correct options</Box>
							</Typography>
							
							<ToggleButtonGroup
								value={correctOption}
								onChange={handleCorrectOption}
								aria-label="correct answer for the question"
								exclusive={state}
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

						{ questions.length > 0 ? (
							
							<form className={classes.form} noValidate>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="titleQuestion"
									label="Title Question"
									name="Title Question"
									autoFocus
									defaultValue={questions[qsID].question}
									onChange={onInputChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="Opt1"
									label="Option 1"
									name="Option 1"
									autoFocus
									defaultValue={questions[qsID].optionA}
									onChange={onOptionAChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="Opt2"
									label="Option 2"
									name="Option 2"
									autoFocus
									defaultValue={questions[qsID].optionB}
									onChange={onOptionBChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="Opt3"
									label="Option 3"
									name="Option 3"
									autoFocus
									defaultValue={questions[qsID].optionC}
									onChange={onOptionCChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="Opt4"
									label="Option 4"
									name="Option 4"
									autoFocus
									defaultValue={questions[qsID].optionD}
									onChange={onOptionDChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="Opt5"
									label="Option 5"
									name="Option 5"
									autoFocus
									defaultValue={questions[qsID].optionE}
									onChange={onOptionEChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="Opt6"
									label="Option 6"
									name="Option 6"
									autoFocus
									defaultValue={questions[qsID].optionF}
									onChange={onOptionFChange}
								/>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="videoUrl"
									label="Optional Video Url Attachment"
									name="Optional Video Url Attachment"
									autoFocus
									defaultValue={questions[qsID].videoUrl}
									onChange={onVidLinkChange}
								/>

								<input
									accept="image/*"
									className={classes.input}
									id="icon-button-photo"
									onChange={handleCapture}
									type="file"
                />
                <label htmlFor="icon-button-photo">
									<IconButton color="primary" component="span">
											<PhotoCamera />
									</IconButton>
                </label>

								{ (error !== '')
									? (<Alert severity="error">{error}</Alert>)
									: (null)}
								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={updateQs}
								>
									Submit
								</Button>
							
							</form>)
							: (null)

						}
						
					</div>
				</Container>
    </React.Fragment>
  );
};
