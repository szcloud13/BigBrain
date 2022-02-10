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
	const classes = useStyles();
	const [error, setErrorName] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [results, setResults] = React.useState([]);
	
	const handleClickOpen = () => {
    setErrorName('');
    setOpen(true);
  };

  const handleClose = () => {
    setErrorName('');
    setOpen(false);
	};
	
  async function fetchData() {
		console.log('getting questions....');
		var playerID = window.location.href.split('=')[1];
    
    
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${url}play/${playerID}/results`, request)
    .then((r) => r.json())
    .then((r) =>{
      console.log(r);
      setResults(r);
    })
    .catch ((e) =>{
      setErrorName(e);
    });
	}
	React.useEffect(() => {
		fetchData();
	}, []);
	

    return(
        <React.Fragment>
          <CssBaseline/>
            { (error !== '')
							? (<Alert severity="error">{error}</Alert>)
							: (null)}
					<Container component="main" maxWidth="xl" className={classes.paper}>
					<Avatar className={classes.green}>
						<AssignmentIcon />
					</Avatar>
					<Typography className={classes.typography} component="h1" variant="h4">
						Results
					</Typography>
					<Table size="small">
							<TableHead>
							<TableRow>
									<TableCell>Question</TableCell>
									<TableCell>Your Options</TableCell>
									<TableCell>Result</TableCell>
									{/* <TableCell>Time (In seconds)</TableCell>
									<TableCell>Question Mark</TableCell>
									<TableCell>Edit</TableCell>
									<TableCell align="right">Delete</TableCell> */}
							</TableRow>
							</TableHead>
							{results.length > 0
							? (
									<TableBody>
									{results.map((row, id) => (
											<TableRow key={id}>
												<TableCell>Question{id}</TableCell>

												<TableCell>
													{
														row.answerIds.map((a, idx) => {
															return (<Box key={idx}>{a}</Box>)
														})
													}	
												</TableCell>

												<TableCell>
													{row.correct ? (<Box>Correct</Box>)
																							 : (<Box>Wrong</Box>)
													}
												</TableCell>
												{console.log(row.correct)}
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
							component={Router.Link} to={"/join"}
							>
							Join another session!
							</Button>
					</div>
					</Container>
        </React.Fragment>
    );
}









