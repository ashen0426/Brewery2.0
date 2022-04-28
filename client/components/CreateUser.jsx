import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CreateUser = () => {

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [homestate, setHomeState] = useState()
  const [firstname, setFirstName] = useState()
  const [lastname, setLastName] = useState()
  let navigate = useNavigate()

  // function loginClick() {
  //   navigate('/home');
  // }

  const handleSubmit = async (e) => {
    e.preventDefault() //So that form submission doesn't trigger a page refresh
    const user = { username, password }
    try {
      const response = await axios.post('/createUser', {
        newUser: {
          username: username,
          password: password,
          homestate: homestate,
          firstname: firstname,
          lastname: lastname,
        },
      })
      navigate('/')
    } catch (error) {
      console.log(error)
      navigate('/createuser')
    }
  }

  return (
    <div className="signInForm">
      <h1>Join Up and Drink Up</h1>

      <div>
        <form className='createuser' onSubmit={handleSubmit}>
          <div>
            <input

              autoComplete="off"
              className="submitItem"
              name="username"
              type="text"
              placeholder="username"
              autoFocus

              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div>
            <input

              autoComplete="off"
              className="submitItem"
              name="password"
              type="password"
              placeholder="password"

              onChange={({ target }) => setPassword(target.value)}
            ></input>
          </div>
          <div>
            <select selected="homestate" class='classic' onChange={({ target }) => setHomeState(target.value)}>
              <option value='' disabled selected>Home State</option>
              <option value='Alabama'>AL</option>
              <option value='Alaska'>AK</option>
              <option value='Arizona'>AZ</option>
              <option value='Arkansas'>AR</option>
              <option value='California'>CA</option>
              <option value='Colorado'>CO</option>
              <option value='Connecticut'>CT</option>
              <option value='Delaware'>DE</option>
              <option value='Florida'>FL</option>
              <option value='Georgia'>GA</option>
              <option value='Hawaii'>HI</option>
              <option value='Idaha'>ID</option>
              <option value='Illinois'>IL</option>
              <option value='Indiana'>IN</option>
              <option value='Iowa'>IA</option>
              <option value='Kansas'>KS</option>
              <option value='Kentucky'>KY</option>
              <option value='Louisiana'>LA</option>
              <option value='Maine'>ME</option>
              <option value='Maryland'>MD</option>
              <option value='Massachusetts'>MA</option>
              <option value='Michigan'>MI</option>
              <option value='Minnesota'>MN</option>
              <option value='Mississippi'>MS</option>
              <option value='Missouri'>MO</option>
              <option value='Montana'>MT</option>
              <option value='Nebraska'>NE</option>
              <option value='Nevada'>NV</option>
              <option value='New_Hampshire'>NH</option>
              <option value='New_Jersey'>NJ</option>
              <option value='New_Mexico'>NM</option>
              <option value='New_York'>NY</option>
              <option value='North_Carolina'>NC</option>
              <option value='North_Dakota'>ND</option>
              <option value='Ohio'>OH</option>
              <option value='Oklahoma'>OK</option>
              <option value='Oregon'>OR</option>
              <option value='Pennsylvania'>PA</option>
              <option value='Rhode_Island'>RI</option>
              <option value='South_Carolina'>SC</option>
              <option value='South_Dakota'>SD</option>
              <option value='Tennessee'>TN</option>
              <option value='Texas'>TX</option>
              <option value='Utah'>UT</option>
              <option value='Vermont'>VT</option>
              <option value='Virginia'>VA</option>
              <option value='Washington'>WA</option>
              <option value='West_Virginia'>WV</option>
              <option value='Wisconsin'>WI</option>
              <option value='Wyoming'>WY</option>
            </select>
          </div>
          <div>
            <input

              autoComplete="off"
              className="submitItem"
              name="firstname"
              type="text"
              placeholder="firstname"

              onChange={({ target }) => setFirstName(target.value)}
            ></input>
          </div>
          <div>
            <input

              autoComplete="off"
              className="submitItem"
              name="firstname"
              type="text"
              placeholder="lastname"

              onChange={({ target }) => setLastName(target.value)}
            ></input>
          </div>


          <input
            className="submitButton"
            type="submit"
            value="Create User"
          ></input>

        </form>
      </div>
    </div>
  )
}

export default CreateUser
