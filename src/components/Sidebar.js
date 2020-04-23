import React, { useContext } from 'react'
import { PlayerContext } from "../context";
import locations from '../json/locations.json'

const Sidebar = () => {
    const playerContext = useContext(PlayerContext);
    const { setView } = playerContext;

    let parsedLocations = Object.keys(locations)

    return <div style={{width: 300, background: '#D7D7D7', borderRight: '1px solid black'}}>
        {parsedLocations.map((e, i) => <div onClick={() => setView(e)} key={i} style={{width: '100%', height: 40, background: '#F8F8F8', borderBottom: '1px solid green'}}>
            <p style={{margin: 0, padding: 10, userSelect: 'none', cursor: 'pointer'}}>{e}</p>
        </div> )}
    </div>
}

export default Sidebar