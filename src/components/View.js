import React, { useContext, useEffect } from 'react'
import { PlayerContext } from "../context";
import Activity from '../components/Activity';

const View = () => {
    const playerContext = useContext(PlayerContext);
    const { view, createLocation, locationActivities} = playerContext

    useEffect(() => {
        createLocation(view);
      }, [view]);

    return (<div style={{flexGrow: 2, background: '#C0FFEE'}}>
        {locationActivities.map((e, i) => <div key={i}>
            <Activity name={e.name} source={e.source} dropClicks={10} drop={e.drop} id={e.id}/>
        </div>)}
    </div>)
}

export default View
