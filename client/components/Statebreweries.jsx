import React, { useState, useEffect, useContext } from 'react'
import UserContext from './UserDetails'
import Brewery from './Brewery'
import axios from 'axios'

const StateBreweries = (props) => {
  const stateBreweries = props.stateBreweries
  const addStateToVisited = props.addStateToVisited

  const stateBreweriesArray = stateBreweries.map((brewery, index) => {
    return (
      <Brewery
        {...brewery} //passing all of the properties down for each brewery
        addStateToVisited={addStateToVisited}
        breweryComp={'state'}
        uniqueid={`StateBrewery${index}`} //avoiding conflicts with database field id
        key={`StateBrewery${index}`}
      />
    )
  })
  return (
    <div className="columnStyle">
      <h2>Breweries in Your State</h2>
      {stateBreweriesArray}
    </div>
  )
}

export default StateBreweries
