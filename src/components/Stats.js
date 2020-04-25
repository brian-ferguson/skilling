import React, { useContext } from 'react'
import { PlayerContext } from "../context";

const Stats = () => {
    const playerContext = useContext(PlayerContext);

    const { stats } = playerContext

    return <div className="stats" style={{width: 300, margin: 0}}>
        {
            stats.map((e, i) => <div key={i} style={{textAlign: 'center', borderBottom: '1px solid black', background: '#F2F2F2'}}>
                <p style={{margin: 0}}>{e.name}</p>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <p style={{margin: 0}}>Experience: {e.experience}</p>
                    <p style={{margin: 0}}>Level: {e.level}</p>
                </div>
            </div>)
        }
    </div>
}

export default Stats