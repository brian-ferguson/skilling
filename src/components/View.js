import React, { useContext } from 'react'
import { PlayerContext } from "../context";
import Activity from '../components/Activity';

const View = () => {
    const playerContext = useContext(PlayerContext);
    const { locationActivities } = playerContext

    return <div style={{flexGrow: 2, background: '#C0FFEE', display: 'flex', flexDirection: 'row'}}>
        {locationActivities.map((e, i) => <div key={i}>
            <Activity name={e.name} source={e.source} dropClicks={10} drop={e.drop} id={e.id} type={e.type} />
        </div>)}
    </div>
}

export default View
