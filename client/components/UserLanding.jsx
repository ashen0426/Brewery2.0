
import React, { useEffect, useState, useContext } from 'react';
import StateBreweries from './StateBreweries';
import VisitedBreweries from './VisitedBreweries';
import UserContext from './UserDetails';
import axios from 'axios';
import reactDom from 'react-dom';

const UserLanding = () => {
  //Batching state changes in React leading to onClick update lags????
  const [stateBreweries, setStateBreweries] = useState();
  const [visBreweries, setVisBreweries] = useState();
  const user = useContext(UserContext).user;

  useEffect(() => {
    //Obtaining state upon user hitting landing page - user's state breweries and visited breweries
    const getBreweries = async () => {
      if (user) {
        console.log('user inside useeffect', user);
        try {
          const response = await axios.get(`/api?homestate=${user.homestate}&username=${user.username}&userId=${user.id}`)
          setStateBreweries(response.data.getBreweries)
          setVisBreweries(response.data.visited)
        } catch (error) {
          console.log(error)
        }
      }
    }
    getBreweries()
  }, [])

  useEffect(() => {
    console.log('State has changed');
    //state has changed but must be batching updates becaues not rerendering right away
  }, [stateBreweries, visBreweries]);

  const addStateToVisited = async (breweryDetails) => {
    // Add state brewery to visited brewery list
    const response = await axios.post('/visited/add', {
      addVisited: {
        breweryid: breweryDetails.id,
        breweryname: breweryDetails.name,
        brewerytype: breweryDetails.brewery_type,
        brewerystate: breweryDetails.state,
        brewerycity: breweryDetails.city,
        breweryphone: breweryDetails.phone,
        userId: user.usersid,
      },
      // params: { userId: user.usersid }, //Having trouble sending over user id as separate params
    })

    //Skips re-rendering sometimes....think due to automatchic batching...
    setVisBreweries([...response.data.visited]);
  };

  const removeVisited = async (breweryDetails) => {
    //Add state brewery to visited brewery list
    const response = await axios.delete('/visited/delete', {
      data: {
        breweryid: breweryDetails.id,
        breweryname: breweryDetails.name,
        brewerytype: breweryDetails.brewery_type,
        brewerystate: breweryDetails.state,
        brewerycity: breweryDetails.city,
        breweryphone: breweryDetails.phone,
        userId: user.usersid,
      },
      // params: { userId: user.usersid },
    })

    setVisBreweries([...response.data.visited])
  }
  const handleSubmit = async (e) => {
    e.preventDefault() //So that form submission doesn't trigger a page refresh

    // send the username and password to the server
    try {
      const response = await axios.post('/userlanding', {
        userInfo: {
          deleteAccount: deleteAccount
        },
      })
      //If success then update context for logged in user and redirect them...
    } catch (error) {
      console.log(error)
    }
    // params: { userId: user.usersid }, //Having trouble sending over user id as separate params
  }
  if (stateBreweries) {

    //Only rendering after mount side effect runs to retrieve state breweries
    return (
      <div className="containerStyle">
        <StateBreweries
          stateBreweries={[...stateBreweries]}
          addStateToVisited={addStateToVisited}
        />
        <VisitedBreweries
          visBreweries={[...visBreweries]}
          removeVisited={removeVisited}
        />
        <div>
          <input className='deleteAccount' type='submit' value='true' color='red'>Delete Account</input>
        </div>
      </div>
    )
  }
}

export default UserLanding
