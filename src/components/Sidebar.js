import React, { useContext } from 'react'
import { PlayerContext } from "../context";

const Sidebar = () => {
    const playerContext = useContext(PlayerContext);
    const { setView, work, locations } = playerContext;

    const exploreLocation = newLocation => {
        if (!work) {
            setView(newLocation)
        }
    }

    return <div style={{width: 300, background: '#D7D7D7', borderRight: '1px solid black'}}>
        {locations.map((loc) => <div onClick={() => exploreLocation(loc.id)} key={loc.id} style={{width: '100%', height: 40, background: '#F8F8F8', borderBottom: '1px solid green'}}>
            <p style={{margin: 0, padding: 10, userSelect: 'none', cursor: 'pointer'}}>{loc.name}</p>
        </div> )}
    </div>
}

export default Sidebar
