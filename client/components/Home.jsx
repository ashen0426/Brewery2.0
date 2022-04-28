import React, { useContext, useEffect } from 'react'
import { Link, useNavigate, Redirect } from 'react-router-dom'
import axios from 'axios';
import UserContext from './UserDetails'

function parseCookie(cookieStr) {
  const cookieObj = cookieStr.split(';')
    .map(val => val.split('='))
    .reduce((acc, val) => {
      acc[decodeURIComponent(val[0].trim())] = decodeURIComponent(val[1].trim());
      return acc;
    }, {});
  return cookieObj;
  }

const Home = () => {
  let navigate = useNavigate()
  const user = useContext(UserContext).user;
  console.log(user)

  // check if user has a cookie in browser and one has been stored in our db
  // if so, log user in
  useEffect(() => {
    const cookieObj = parseCookie(document.cookie);
    console.log(cookieObj);
    async function checkCookie() {
      const userObj = await axios.get(`/getUser/${cookieObj.userName}`)
      if (userObj.hasCookie) setUser(userObj);
      else console.log('cookie not found in db')
    }
    // only invoke the above function if there is a userName in the cookieObj
    if (cookieObj.userName) checkCookie();
  }, []);
  console.log(user);

  //If user is already logged in via coolies/storage (TBD by Colton) then redirect to their landing page
  useEffect(() => {
    if (user) {
      navigate('/userlanding')
    }
  }, [user]);

  function loginClick() {
    navigate('/login')
  }

  function createClick() {
    navigate('/createuser')
  }

  if (!user) {
    return (
      <div className="home">
        <button className="create-Btn" onClick={() => createClick()}>
          New to FindMyBrews? Click here for your Passport!
        </button>
        <button className="login-Btn" onClick={() => loginClick()}>
          Already have your Passport? Click here to log in!
        </button>
        {/* <Link to="/home">Home</Link>  */}
      </div>
    )
    // } else {
    //   // <Redirect to="/userlanding" />;
    //   navigate('/createuser');
    // }
  }
}

export default Home
