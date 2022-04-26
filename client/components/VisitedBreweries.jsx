import React, { useState, useEffect, useContext } from 'react'
import UserContext from './UserDetails'
import Brewery from './Brewery'

const VisitedBreweries = (props) => {
  const visBreweries = props.visBreweries
  const removeVisited = props.removeVisited

  const visBreweriesArray = visBreweries.map((brewery, index) => {
    return (
      <Brewery
        {...brewery} //passing all of the properties down for each brewery
        removeVisited={removeVisited}
        breweryComp={'visited'}
        uniqueid={`VisBrewery${index}`} //avoiding conflicts with database field id
        key={`VisBrewery${index}`}
      />
    )
  })
  return (
    <div className="visitedBreweries">
      <h2>Visited Breweries</h2>
      {visBreweriesArray}
    </div>
  )
}

export default VisitedBreweries
