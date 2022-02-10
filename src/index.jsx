// import React from 'react';
// import ReactDOM from 'react-dom';
// import * as Router from 'react-router-dom';
// import Header from './Header';
// import SignUp from './SignUp';
// import SignIn from './SignIn';
// import App from './App';
// import './index.css';

// export default function Routing() {
//   return (
//     <React.StrictMode>
//       <Router.BrowserRouter>
//         <div>
//           <Router.Switch>
//             <Router.Route path="/admin/signup">
//               <Header />
//               <SignUp />
//             </Router.Route>
//             <Router.Route path="/admin/signin">
//               <Header />
//               <SignIn />
//             </Router.Route>
//             <Router.Route path="/">
//               <Header />
//               <App />
//             </Router.Route>
//           </Router.Switch>
//         </div>
//       </Router.BrowserRouter>
//     </React.StrictMode>

//   );
// }

// ReactDOM.render(<Routing />, document.getElementById('root'));
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
