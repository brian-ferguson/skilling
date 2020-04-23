import React, { useContext } from 'react'
import { PlayerContext } from "../context";
import locations from '../json/locations.json'

const Sidebar = () => {
    const playerContext = useContext(PlayerContext);
    const { setView } = playerContext;

    let parsedLocations = Object.keys(locations)

    return <div style={{width: 300, background: '#E7DE7D'}}>
        {parsedLocations.map((e, i) => <div onClick={() => setView(e)} key={i} style={{width: '100%', height: 40, background: '#D7ED7E', borderBottom: '1px solid green'}}>
            <p style={{margin: 0, padding: 10, userSelect: 'none', cursor: 'pointer'}}>{e}</p>
        </div> )}
    </div>
}

export default Sidebar