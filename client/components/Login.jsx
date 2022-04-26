import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import UserContext from './UserDetails'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault() //So that form submission doesn't trigger a page refresh

    // send the username and password to the server
    try {
      const response = await axios.post('/login', {
        userInfo: {
          username: username,
          password: password,
        },
      })
      //If success then update context for logged in user and redirect them...
      if (response.data === 'Login Success') {
        navigate('/createuser') //if successfull, send to UserLanding route
      }
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    // params: { userId: user.usersid }, //Having trouble sending over user id as separate params
  }

  return (
    <div className="loginForm">
      <h1>Login</h1>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              autoFocus
              autocomplete="off"
              className="submitItem"
              name="username"
              type="text"
              placeholder="username"
              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div>
            <input
              autocomplete="off"
              className="submitItem"
              name="password"
              type="password"
              placeholder="password"
              onChange={({ target }) => setPassword(target.value)}
            ></input>
          </div>
          <input className="submitButton" type="submit" value="Login"></input>
        </form>
      </div>
    </div>
  )
}

export default Login
