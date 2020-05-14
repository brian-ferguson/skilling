import React, { useContext } from 'react'
import { PlayerContext } from "../context";

const Sidebar = () => {
    const playerContext = useContext(PlayerContext);
    const { setView, work, locations, user } = playerContext;

    const exploreLocation = newLocation => {
        if (!work) {
            setView(newLocation)
        }
    }

    const checkRequirements = (statRequirements, itemRequirements) => {
        if (!statRequirements && !itemRequirements) {
            return true
        }

        let itemCheck = 0
        let statCheck = 0

        if (itemRequirements) {
            for (let i = 0; i < itemRequirements.length; i++) {
                if(user.inventory.filter(e => e.id === itemRequirements[i])) {
                    itemCheck++
                }
            }
        }

        if (statRequirements) {
            for (let i = 0; i < statRequirements.length; i++){
                if(user.stats && user.stats[statRequirements[i].skillName].level >= statRequirements[i].levelRequirement) {
                    statCheck++
                }
            }
        }

        if (statRequirements && itemRequirements) {
            if (statCheck === statRequirements.length && itemCheck === itemRequirements.length) {
                return true
            } else {
                return false
            }
        } else if (statRequirements && !itemRequirements) {
             if (statCheck === statRequirements.length) {
                return true
            } else {
                return false
            }
        } else if (!statRequirements && itemRequirements) {
            if (itemCheck === itemRequirements.length) {
                return true
            } else {
                return false
            }
        }

    }

    let newLocations;
    if (user) {
        newLocations = locations.filter(e => checkRequirements(e.statRequirements, e.itemRequirements))
    }

    return <div style={{minWidth: 200, background: '#D7D7D7', borderRight: '1px solid black'}}>
        {user && newLocations.map((loc) => <div onClick={() => exploreLocation(loc.id)} key={loc.id} style={{width: '100%', height: 40, background: '#F8F8F8', borderBottom: '1px solid green'}}>
            <p style={{margin: 0, padding: 10, userSelect: 'none', cursor: 'pointer'}}>{loc.name}</p>
        </div> )}
    </div>
}

export default Sidebar
