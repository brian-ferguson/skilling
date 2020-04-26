import React, { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import locations_json from '../json/locations.json'
import activities_json from '../json/activities.json'
import items_json from '../json/items.json'

//context
export const Context = createContext({});

//provider
export const Provider = props => {
	const [view, setView] = useState('Calm Beach')
	const [inventory, setInventory] = useState([]);
	const [stats, setStats] = useState([])
	const [locationActivities, setLocationActivities] = useState([]);

	useEffect(() => {
		let currentLocations = Object.keys(locations_json[view])

		let currentLocationActivities = [];

		//get all the activities of the current location
		for (let i = 0; i < currentLocations.length; i++) {
			let currentActivity = activities_json[currentLocations[i]]
			currentLocationActivities.push(currentActivity)
		}

		if(currentLocationActivities){
			setLocationActivities(currentLocationActivities);
		}
	}, [view])

	const levelFormula = exp => {
		return Math.floor(Math.sqrt(exp) * 1.2);
	};

	const doActivity = (activity) => {

		//get the item with the corresponding id
		let currentDrop = items_json[activity];

		if(currentDrop) {
			//if we already have that experience type, add experience to it
			if (stats.filter(e => e.name === currentDrop.experienceType).length > 0) {
				let current_experience = stats[stats.map(i => i.name).indexOf(currentDrop.experienceType)].experience
				let stat_index = stats.map(i => i.name).indexOf(currentDrop.experienceType)
				let new_stats = [...stats]
				new_stats[stat_index].experience = current_experience + currentDrop.experience
				new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
				setStats(new_stats)
			} else {
				let newStat = { name: currentDrop.experienceType, experience: currentDrop.experience, level: 1 }
				setStats(stats.concat(newStat))
			}
		}

		if(currentDrop){
			if(currentDrop.stacks){
				//if stacks is true, and the item is already in the inventory > increment the item quantity
				if(inventory.filter(e => e.id === currentDrop.id).length > 0){

					//get the quantity of the item in the players Inventory
					let current_quantity = inventory[inventory.map(i => i.id).indexOf(currentDrop.id)].quantity;
					//get the index of the item to be incremented
					const index = inventory.map(i => i.id).indexOf(currentDrop.id);

					let new_inventory =  [...inventory];
					new_inventory[index].quantity = current_quantity + 1;

					setInventory(new_inventory);


				//if stacks is true, and the item is not in the inventory > add the item to the inventory
				}else{
					setInventory(inventory.concat(currentDrop))
				}

			//if stacks is false, add the item to the players inventory
			}else{
				setInventory(inventory.concat(currentDrop))
			}
		}
	};

	const playerContext = {
		inventory,
		setInventory,
		doActivity,
		view,
		setView,
		stats,
		locationActivities,
		setLocationActivities,
	};

	return <Context.Provider value={playerContext}>{props.children}</Context.Provider>

};

//consumer
export const { Consumer } = Context;

//proptype validation
Provider.propTypes = {
  inventory: PropTypes.array,
  items: PropTypes.array,
	activities: PropTypes.array,
	locations: PropTypes.array,
};

Provider.defaultProps = {
  inventory: [],
  items: [],
	activities: [],
	locations: [],
};
