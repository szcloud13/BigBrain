/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {  LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
	},
	paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
	container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
	},
	appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
	},
	appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
	},
	typography: {
    margin: '4px 0',
	},
	green: {
    color: '#fff',
    backgroundColor: green[500],
  },
}));

const url = 'http://localhost:5005/';

export default () => {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	var str = window.location.search.split('/');
	var quizID = str[0].split('?')[1];
	var sessID = str[1].split('?')[1];
	console.log(quizID, sessID);

  async function fetchData() {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
		fetch(`${url}admin/session/${sessID}/results`, request)
		.then((r) => r.json())
		.then((r) => {
			console.log(r);
		})
		.catch((e) =>{
			setErrorName(e);
		});
	}

	function createData(id, date, name, shipTo, paymentMethod, amount) {
		return { id, date, name, shipTo, paymentMethod, amount };
	}
	
	const rows = [
		createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
		createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
		createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
		createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
		createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
	];
	

	fetchData();
	// const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
	
	const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 500, pv: 2700, amt: 2900}, {name: 'Page A', uv: 100, pv: 1400, amt: 2300}, {name: 'Page A', uv: 500, pv: 4400, amt: 400}];
  return (
		<React.Fragment>
			<Container component="main" maxWidth="xl" className={classes.paper}>
				<CssBaseline />
				
				<Avatar className={classes.green}>
					<AccountCircleIcon />
				</Avatar>
				
				<Typography className={classes.typography} component="h1" variant="h4">
					<Box fontWeight="fontWeightBold">Top 5 Players</Box> 
				</Typography>
			</Container>

			<Container maxWidth="xl" className={classes.container}>
				<Paper className={fixedHeightPaper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Ship To</TableCell>
								<TableCell>Payment Method</TableCell>
								<TableCell align="right">Sale Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.date}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.shipTo}</TableCell>
									<TableCell>{row.paymentMethod}</TableCell>
									<TableCell align="right">{row.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
						</Table>
				</Paper>
			</Container>

			<Container component="main" maxWidth="xl" className={classes.paper}>
				<CssBaseline />
				<Avatar className={classes.green}>
					<CheckCircleOutlineIcon />
				</Avatar>
				
				<Typography className={classes.typography} component="h1" variant="h4">
					<Box fontWeight="fontWeightBold">Percentage of players per Question</Box> 
				</Typography>
			</Container>


			<Container maxWidth="xl" className={classes.container}>
				<Grid container spacing={6}>
					{/* Chart */}
					<Grid item xs={12} md={12} lg={9}>
						<Paper className={fixedHeightPaper}>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart width={600} height={300} data={data}>
								<Line type="monotone" dataKey="uv" stroke="#8884d8" />
								<CartesianGrid stroke="#ccc" />
								<XAxis dataKey="name" />
								<YAxis />
							</LineChart>
					
						</ResponsiveContainer>
						</Paper>
					</Grid>
				</Grid>
			</Container>

			<Container component="main" maxWidth="xl" className={classes.paper}>
				<Avatar className={classes.green}>
					<AssignmentIndIcon />
				</Avatar>
				
				<Typography className={classes.typography} component="h1" variant="h4">
					<Box fontWeight="fontWeightBold">Average Response Time For Each Question</Box> 
				</Typography>
			</Container>

			<Container maxWidth="xl" className={classes.container}>
				<Grid container spacing={6}>
					{/* Chart */}
					<Grid item xs={12} md={12} lg={9}>
						<Paper className={fixedHeightPaper}>
						<ResponsiveContainer width="100%" height={400}>

							<BarChart width={150} height={40} data={data}>
								<Bar dataKey="uv" fill="#8884d8" />
								<XAxis dataKey="name" />
								<YAxis />
							</BarChart>

						</ResponsiveContainer>
						</Paper>
					</Grid>
				</Grid>
			</Container>

				


				
			
		
		</React.Fragment>
			
  );
};
