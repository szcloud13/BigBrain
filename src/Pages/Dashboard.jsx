/* eslint-disable */
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import * as Router from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const url = 'http://localhost:5005/';

const useStyles = makeStyles({
  cardContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: '#3f51b5',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
});

export default function () {
  const classes = useStyles();
  const [quizzes, setQuizzes] = React.useState([]);
  const [gameName, setGameName] = React.useState('');
  const [quizzesInfo, setQuizzesInfo] = React.useState([]);
  const [error, setErrorName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openGameStart, setOpenGameStart] = React.useState(false);
  const [openGameEnd, setOpenGameEnd] = React.useState(false);
  const [jsonfile, setjsonfile] = React.useState(null);
  const [sessID, setSessID] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onInputChange = (e) => {
    setErrorName('');
    setGameName(e.target.value);
  };

  const handleCloseGameStart = () => {
    setOpenGameStart(false);
  };

  const handleOpenGameStart = () => {
    setOpenGameStart(true);
  };

  const handleCloseGameEnd = () => {
    setOpenGameEnd(false);
    setSessID(0); // reset
  };

  const handleOpenGameEnd = () => {
    setOpenGameEnd(true);
  };

  function copyToClipboard(gameUrl) {
    navigator.clipboard.writeText(gameUrl);
  }

  async function readFile(file) {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const obj = JSON.parse(e.target.result);
        resolve(obj);
      };
      fr.readAsText(file);
    });
  }

  function fetchQuizzes(qzs, request) {
    const promiseArray = [];
    let i = 0;
    while (i < qzs.length) {
      promiseArray.push(fetch(`${url}admin/quiz/${qzs[i].id}`, request).then((resp) => resp.json()));
      i += 1;
    }
    return Promise.all(promiseArray);
  }

  async function fetchData() {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz`, request)
      .then((r) => r.json())
      .then((r) => {
        setQuizzes(r.quizzes);
        return r.quizzes;
      })
      .then((jsonQuizzes) => fetchQuizzes(jsonQuizzes, request))
      .then((r) => {
        setQuizzesInfo(r);
      })
      .catch((e) => {
        setErrorName(e);
      });
  }

  const handleCapture = ({ target }) => {
    if (target.files[0]) {
      const promise = Promise.resolve();
      promise.then(() => readFile(target.files[0]))
        .then((r) => {
          setjsonfile(r); // store temp
          if (r.name === '') {
            setErrorName('Name of quiz missing');
            handleClose();
          } else if (Array.isArray(r.questions) && r.questions.length > 0) {
            let i = 0;
            while (i < r.questions.length) {
              const q = r.questions[i];
              try {
                if (q.question === '' || q.optionA === '' || q.optionB === '') {
                  setjsonfile(null);
                  setErrorName('An empty Question or less than two options for a new quiz are not acceptable.');
                  handleClose();
                  break;
                }

                if (q.eachQsTime < 10) {
                  setjsonfile(null);
                  setErrorName('Time for each question for a new quiz is only 10-50 seconds');
                  handleClose();
                  break;
                }

                if (q.eachQsMark < 10) {
                  setjsonfile(null);
                  setErrorName('Mark for each question for a new quiz is only 10-60');
                  handleClose();
                  break;
                }

                if (!q.optionC && !q.optionD && !q.optionE
                    && !q.optionF && !q.picUpload && !q.videoUrl) {
                  setjsonfile(null);
                  setErrorName('Missing fields!');
                  handleClose();
                  break;
                }
              } catch {
                setjsonfile(null);
                setErrorName('Missing fields!');
                handleClose();
                break;
              }
              i += 1;
            }
          } else {
            setjsonfile(null);
            setErrorName('Wrong Correct Answers format.');
          }
          console.log(r);
          return r;
        });
    }
  };

  function stopSession(id) {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz/${id}/end`, request)
      .then(() => {
        setErrorName('The quiz has ended!');
        handleCloseGameStart();
        fetchData();
        handleOpenGameEnd();
      });
  }

  function getSessionId(id) {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz/${id}`, request)
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        if (r.active != null) {
          setErrorName(`Let the quiz begin! The session ID is: ${r.active}`);
          setSessID(r.active);
          handleOpenGameStart(true);
          fetchData();
        } else {
          setErrorName('Something went wrong, try again later...');
        }
      });
  }

  function startSession(id) {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    fetch(`${url}admin/quiz/${id}/start`, request)
      .then((r) => r.json())
      .then((r) => {
        if (!r.error) {
          getSessionId(id);
        } else {
          setErrorName('The quiz has already begun!');
        }
      });
  }

  function deleteQuiz(id) {
    const request = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        quizId: id,
      }),
    };
    fetch(`${url}admin/quiz/${id}`, request)
      .then((r) => {
        if (r.status === 200) {
          setErrorName('You deleted a game!');
          fetchData();
        } else {
          setErrorName('Something went wrong, try again later');
        }
      });
  }

  async function createGame() {
    handleClose();
    if (gameName.length !== 0 && jsonfile === null) {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: gameName,
        }),
      };
      return fetch(`${url}admin/quiz/new`, request)
        .then((r) => {
          fetchData();
          return r.json();
        })
        .catch((e) => {
          setErrorName(e);
        });
    } else if (jsonfile.name) {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: jsonfile.name,
        }),
      };
      return fetch(`${url}admin/quiz/new`, request)
        .then((r) => {
          fetchData();
          return r.json();
        })
        .catch((e) => {
          setErrorName(e);
        });
    } else {
      setErrorName('You have not entered a game name!');
    }
  }

  function returnInfo() {
    const list = [];
    quizzes.forEach(({
      active, id, name, thumbnail, oldSessions,
    }, index) => {
      console.log(oldSessions);
      let numQs = 0;
      let duration = 0;
      if (quizzesInfo[index]) {
        numQs = quizzesInfo[index].questions.length;
        quizzesInfo[index].questions.forEach((qinfo) => {
          if (!qinfo.eachQsTime) { // if no such field (internal error)
            duration += 0.5; // seconds
          } else {
            duration += Number(qinfo.eachQsTime); // accumulate time
          }
        });
      }
      list.push(
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={thumbnail}
              title="Image title"
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {name}
              </Typography>

              {active ? (
                <Typography>
                  <Box color="red" fontWeight="fontWeightBold">
                    Session ID:
                    {' '}
                    {active}
                  </Box>
                </Typography>
              ) : (null)}
              {(!active && oldSessions.includes(Number(localStorage.getItem('prevSession')))) ? (
                <Typography>
                  <Box color="red" fontWeight="fontWeightBold">
                    Results from previous session:
                    <Button component={Router.Link} to={`/admin/results/quizid?${id}/sessionid?${localStorage.getItem('prevSession')}`} color="secondary">
                      {localStorage.getItem('prevSession')}
                    </Button>
                  </Box>
                </Typography>
              ) : (null)}
              <Typography>
                <Box fontWeight="fontWeightBold">
                  No of Qs:
                  {' '}
                  {numQs}
                </Box>
              </Typography>
              <Typography>
                <Box fontWeight="fontWeightBold">
                  Duration (sec):
                  {' '}
                  {duration}
                </Box>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => startSession(id)}>
                <Box fontWeight="fontWeightBold">Start</Box>
              </Button>
              <Button size="small" color="primary" component={Router.Link} to={`/admin/editquiz?id=${id}`}>
                <Box fontWeight="fontWeightBold">View / Edit</Box>
              </Button>
              <Button size="small" color="primary" onClick={() => stopSession(id)}>
                <Box fontWeight="fontWeightBold">End</Box>
              </Button>
              <Button size="small" color="primary" onClick={() => deleteQuiz(id)}>
                <Box fontWeight="fontWeightBold">Delete</Box>
              </Button>
            </CardActions>
          </Card>
          <Dialog open={openGameStart} onClose={handleCloseGameStart} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Quiz</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Let the quiz begins! The session ID is
                {' '}
                {sessID}
              </DialogContentText>
              <DialogContentText>
                Use button to copy the link to the quiz play screen!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => copyToClipboard(`http://localhost:3000/admin/${id}/${sessID}`)} color="primary">
                Copy Link
              </Button>
              <Button onClick={handleCloseGameStart} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openGameEnd} onClose={handleCloseGameEnd} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Quiz</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You have ended the quiz of session ID
                {' '}
                {sessID}
              </DialogContentText>
              <DialogContentText>
                Would you like to view the results?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseGameEnd} component={Router.Link} to={`/admin/results/quizid?${id}/sessionid?${sessID}`} color="primary">
                View Results
              </Button>
              <Button onClick={handleCloseGameEnd} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>,
      );
    });
    return list;
  }

  function makeRequestBody() {
    const promise = new Promise((resolve) => {
      const request = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          questions: jsonfile.questions,
          name: jsonfile.name,
        }),
      };
      resolve(request);
    });
    return promise;
  }

  async function requestQuizUpdate(request, quizID) {
    console.log(request);
    try {
      const response1 = await fetch(`${url}admin/quiz/${quizID}`, request);
      const resp = await response1.json();
      console.log(resp);
      if (response1.status === 200) {
        fetchData();
        setErrorName('Your request was successful!');
        console.log('success');
      } else {
        console.log(response1.status);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function updateQz() {
    let quizid = 0;
    // if theres gamename and no json
    if (gameName.length !== 0 && jsonfile == null) {
      createGame();
    // if theres no gamename and a json
    } else if (gameName.length == 0 && jsonfile !== null) {
        createGame()
        .then((resp) => {
          quizid = resp.quizId;
          return makeRequestBody(jsonfile.questions);
        })
        .then((request) => {
          if (request) {
            requestQuizUpdate(request, quizid);
          }
        }) // call backend
        .catch((e) => {
          console.log(e);
        });
    } else if (gameName.length !== 0 && jsonfile !== null) {
      createGame()
        .then((resp) => {
          quizid = resp.quizId;
          return makeRequestBody(jsonfile.questions);
        })
        .then((request) => {
          if (request) {
            requestQuizUpdate(request, quizid);
          }
        }) // call backend
        .catch((e) => {
          console.log(e);
        });
    } else {
      setErrorName('You have not entered a game name!');
    }
  }

  React.useEffect(() => {
    async function fetchDataUseEffect() {
      const request = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      fetch(`${url}admin/quiz`, request)
        .then((r) => r.json())
        .then((r) => {
          setQuizzes(r.quizzes);
          return r.quizzes;
        })
        .then((jsonQuizzes) => fetchQuizzes(jsonQuizzes, request))
        .then((r) => {
          setQuizzesInfo(r);
        })
        .catch((e) => {
          setErrorName(e);
        });
    }
    fetchDataUseEffect();
  }, []);

  return (
    <>
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
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                  Create New Game!
                </Button>
              </Grid>
            </Grid>
          </div>
          { (error !== '')
            ? (
              <Alert severity="error">
                <Box fontWeight="fontWeightBold">
                  {' '}
                  {error}
                </Box>
              </Alert>
            )
            : (null)}
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="lg">
        <Grid container spacing={4}>
          { quizzesInfo.length > 0 && quizzes.length > 0
            ? (returnInfo(quizzes, quizzesInfo))
            : (null)}
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Quiz</DialogTitle>
        { (error !== '')
          ? (
            <Alert severity="error">
              <Box fontWeight="fontWeightBold">
                {' '}
                {error}
              </Box>
            </Alert>
          ) : (null)}
        <DialogContent>
          <DialogContentText>
            Give your creation a well-suited name!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="A glorious name for your new quiz"
            type="text"
            fullWidth
            onChange={onInputChange}
          />
        </DialogContent>
        <DialogActions>
          <input
            accept="application/JSON"
            id="icon-button-json"
            onChange={handleCapture}
            type="file"
          />
          {/* <Button onClick={handleClose} htmlFor="icon-button-json" color="primary">
                Upload JSON
            </Button> */}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateQz} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}