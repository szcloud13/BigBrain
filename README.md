ReactJS: BigBrain

## 1. Background & Motivation

*An innovative lightweight quiz platform for millenials* that will *revolutionise the secondary and tertiary education market for years*. A web-based application called **BigBrain**.

**This assignment is the process you building the front-end for that MVP to the standards described.** This assignment is closely modelled off the popular game [kahoot](https://kahoot.com/). If you're not familiar with the game, we would recommend spending the time to try it out so that you can get a feel for how this application may function.

## 2. The Front-end

Navigate to the `frontend` folder and run `yarn install` to install all of the dependencies necessary to run the ReactJS app. Then run `yarn start` to start the ReactJS app.

### 2.1. Feature 1. Admin Auth 

#### 2.1.1. Login Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password`.
 * If the form submission fails, a reasonable error message is shown
 * A button must exist to allow submission of form

#### 2.1.2. Register Screen
 * A unique route must exist for this screen
 * User must be able to enter their `email` and `password` and `name`
 * A button must exist to allow submission of form

#### 2.1.3. Logout Button
 * On all screens that require an authorised user, a logout button exists.
 * This logout button, when clicked, returns you to the login screen.

### 2.2. Feature 2. Admin Creating & Editing a Game (20%)

#### 2.2.1. Dashboard
 * A unique route must exist for this screen
 * A dashboard of all games is displayed, where each game shows the title, number of questions, a thumbnail, and a total time to complete (sum of all individual question times)
 * Each game listed should have a clickable element relating to it that takes you to the screen to edit that particular game
 * A button exists on this screen that allows you to create a new game, provided a name for the game. Clicking it creates a new game on the server and adds another visible game to the dashboard.
 ** A button exists on this screen that allows you to delete a particular game.

#### 2.2.2. Edit BigBrain Game
 * A unique route must exist for this screen that is parameterised on the game ID
 * This screen allows users to select the question they want to edit
 * This screen allows users to delete a particular question, or add a new question

#### 2.2.3. Edit BigBrain Game Question
 * A unique route must exist for this screen that is parameterised both on the Game ID and the question ID
 * Editable items on this page include:
   * The question type (multiple choice, single choice)
   * The question itself (as a string)
   * Time limit that users have to answer the question
   * Points for how much the question is worth
   * The ability to optionally attach a URL to a youtube video, or upload a photo, to enhance the question being asked).
   * Anywhere between 2 and 6 answers, that each contain the answer as a string

### 2.3. Feature 3. Admin Start, Stop, Results of game (10%)

#### 2.3.1. Starting a game
 * On the dashboard page, add the ability to start a stopped game
 * When the game is started, a popup is displayed that shows the session ID of the game as a string
 * This session idea should be able to be copied by some kind of "Copy Link" button/element. When this item is clicked, a direct URL is copied to the clipboard. When going to this URL, the users should be given play screen (described in `2.4`) with the session code already pre-populated.

#### 2.3.2. Stopping a game
 * On the dashboard page, the ability to stop a started game.
 * When the game is stopped, a popup appears that prompts the admin "Would you like to view the results?" If they click yes, they are taken to the screen described in `2.3.3`

#### 2.3.3. Getting the results of a game
 * A unique route must exist for this screen that is parameterised on the session ID
 * Once the screen loads, it should display the following:
   * Table of up to top 5 users and their score
   * Bar/Line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct
   * Some chart showing the average response/answer time for each question
   * Any other interesting information you see fit

### 2.4. Feature 4. Player able to join and play game 

#### 2.4.1. Play Join
 * A unique route must exist for this screen
 * A user is able to enter a session ID and their own name to attempt to join the session. If succesful, they're taken to `2.4.2`.

#### 2.4.2. Play Game
 * On this screen the user is given the current question being asked. This consists of:
   * The question text
   * A video or image depending on whether it exists.
   * A countdown with how many seconds remain until you can't answer anymore.
   * A selection of either single or multiple answers, that are clickable.
 * The answer shall be sent to the server the moment the user starts making selections. If further selections are modified, more requests are sent
 * When the timer hits 0, the answer/results of that particular question are displayed
 * The answer screen remains visible until the admin advances the quiz question onto the next question.

#### 2.4.3. Game Results
 * After the final question is answered, a page is displayed showing the key results:
   * The player's performance in each question

### 2.5. Advanced Features (10%) (THIS IS NOT BONUS FEATURES)
 * For `2.2.1`, when a new game is created, the user can optionally upload a .csv or .json (you choose) file containing the full data for a game. The data structure is validated on the frontend before being passed to the backend normally. You should provide a copy of an example data file in your project repo.
 * If you implement this feature, you must attach an example .csv or .json into your repo in the project folder. This file must have name `2.5.json`  or `2.5.csv`. This is so we can actually test that it works while marking.

### 2.6. Linting

* Linting must be run from inside the `frontend` folder by running `yarn lint`.


## 3. The Back-end

To run the backend server, simply run `npm run backend` in the project directory. This will start the backend.

Backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. If you want to reset the data in the backend, you can run `npm run reset`. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`.

Once the backend has started, you can view the API documentation by navigating to `http://localhost:[port]` in a web browser.

**The backend is only stubbed for the time being. The routes function, though return 200 with no payload. This will change by the end of the first week**

The port that the backend runs on (and that the frontend can use) is specified in `frontend/src/config.json`.

### 2.7. Testing (TODO)

For **component testing**, you must:
 * Write tests for at least 3 different components
 * For each of the 3 components, they mustn't have more than 50% similarity (e.g. you can't test a "Card" component and a "BigCard" component, that are virtually the same)
 * Ensure your tests have excellent **coverage** (look at all different use cases and edge cases)
 * Ensure your tests have excellent **clarity** (well commented and code isn't overly complex)
 * Ensure your tests are **designed** well (logical ordering of tests, avoid any tests that aren't necessary or don't add any meaningful value)
 * (We encourage you to only use shallow component rendering)

For **ui testing**, you must:
 * Write a single test for the "happy path" of an admin that is described as:
   1. Registers successfully
   2. Creates a new game successfully
   3. (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)
   4. Starts a game successfully
   5. Ends a game successfully (yes, no one will have played it)
   6. Loads the results page successfully
   7. Logs out of the application successfully
   8. Logs back into the application successfully

Tests must be run from inside the `frontend` folder by running `yarn test`.
