import React, { useContext } from 'react'
import { PlayerContext } from "../context";
import locations from '../json/locations.json'

const View = () => {
    const playerContext = useContext(PlayerContext);
    const { view } = playerContext

    let currentLocations = Object.keys(locations[view])

    return <div style={{flexGrow: 2, background: '#C0FFEE'}}>
        {currentLocations.map((e, i) => <div key={i}>
            <p>{e}</p>
        </div>)}
    </div>
}

export default View