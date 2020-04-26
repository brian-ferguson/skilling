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
		let currentDrop = items_json[activity];

		const updateStats = (arr, setter) => {
			if (arr.filter(e => e.name === currentDrop.experienceType).length > 0) {
				let current_experience = arr[arr.map(i => i.name).indexOf(currentDrop.experienceType)].experience
				let stat_index = arr.map(i => i.name).indexOf(currentDrop.experienceType)
				let new_stats = [...arr]
				new_stats[stat_index].experience = current_experience + currentDrop.experience
				new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
				setter(new_stats)
			} else {
				let newStat = { name: currentDrop.experienceType, experience: currentDrop.experience, level: 1 }
				setter(arr.concat(newStat))
			}
		}

		const collectResource = () => {
			if(currentDrop.stacks){
				updateStats(stats, setStats)
				if(inventory.filter(e => e.id === currentDrop.id).length > 0){
					let current_quantity = inventory[inventory.map(i => i.id).indexOf(currentDrop.id)].quantity;
					const index = inventory.map(i => i.id).indexOf(currentDrop.id);
					let new_inventory =  [...inventory];
					new_inventory[index].quantity = current_quantity + 1;
					setInventory(new_inventory);
				}else{
					setInventory(inventory.concat(currentDrop))
				}
			}else{
				setInventory(inventory.concat(currentDrop))
			}	
		}
		
		const refineResource = () => {
			if(inventory.filter(e => e.name === currentDrop.requirement)[0]) {
				updateStats(stats, setStats)
				if(currentDrop.stacks){
					if(inventory.filter(e => e.id === currentDrop.id).length > 0){
						let item_current_quantity = inventory[inventory.map(i => i.id).indexOf(currentDrop.id)].quantity;
						let refine_current_quantity = inventory[inventory.map(i => i.name).indexOf(currentDrop.requirement)].quantity;
						let item_index = inventory.map(i => i.id).indexOf(currentDrop.id);
						let refine_index = inventory.map(i => i.name).indexOf(currentDrop.requirement)
						let new_inventory = [...inventory];
						if (new_inventory[refine_index].quantity > 0) {
							new_inventory[item_index].quantity = item_current_quantity + 1;
							new_inventory[refine_index].quantity = refine_current_quantity - 1;
						}
						if(new_inventory[refine_index].quantity === 0) {
							new_inventory = new_inventory.filter(e => e !== new_inventory[refine_index])
						}
						setInventory(new_inventory);
					}else{
						let refine_current_quantity = inventory[inventory.map(i => i.name).indexOf(currentDrop.requirement)].quantity;
						let refine_index = inventory.map(i => i.name).indexOf(currentDrop.requirement)
						let new_inventory = [...inventory];
						new_inventory[refine_index].quantity = refine_current_quantity - 1;
						if(new_inventory[refine_index].quantity === 0) {
							new_inventory = new_inventory.filter(e => e !== new_inventory[refine_index])
						}
						setInventory(inventory.concat(currentDrop))
					}
				}else{
					setInventory(inventory.concat(currentDrop))
				}
			}
		}

		if(currentDrop){
			if(currentDrop.type === 'Collect') {
				collectResource()
			} else if (currentDrop.type === 'Refine' || 'Cook') {
				refineResource()
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
