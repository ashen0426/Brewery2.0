import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import React, { createContext } from 'react';
import Login from './Login';
import CreateUser from './CreateUser';
import Home from './Home';
import UserContext from './UserDetails';
import UserLanding from './UserLanding';
import Navbar from './Navbar';
import Footer from './Footer';
//https://www.figma.com/file/2PRdto4pBE6alqIhw9eP4z/Brewery-App?node-id=0%3A1
//List component----breweries in state
//Already visited breweries
//Login
//Notes: Had to install react-router to setup front-side routing to different web page
//      1) All components nested within Router component have access to the router
//      2) All routes go inside the Switch component
//      3) Route path is the end point we want to go to and then inside it is the component want to show when they finish that route
//      4) Only what is inside the Routes component is going to get re-rendered
//      5) Routes replaced Switch component in react-router-dom v6 https://www.youtube.com/watch?v=aZGzwEjZrXc

//Hardcoding User Information for Testing Purposes.....would have to fetch this from cookies within UserDetails component I believe....
const user = {
  name: 'Ricky',
  usersid: 2,
  state: 'new_york',
  favorites: ['nyc brew', 'brew4life'],
};

//If don't want user logged in then uncomment below....
// const user = undefined;

const App = () => {
  //Set user information here on load through useeffect?
  // const [userInfo, setUserInfo] = useState('');

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className='App'>
          <div className='navbarHolder'>
            <Navbar />
          </div>
          <div className='spacer'></div>
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/login' element={<Login />}></Route>
            <Route exact path='/createuser' element={<CreateUser />}></Route>
            <Route exact path='/userlanding' element={<UserLanding />}></Route>
            <Route path='*' element={<Navigate to='/' replace />}></Route>
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
