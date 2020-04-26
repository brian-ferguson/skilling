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

		//methods and functions

		//selectDrop: selects a item to drop from weighted probabilities
		const selectDrop = () => {

			let loot = null;
			for (var key in activities_json) {
				if (activities_json.hasOwnProperty(key)) {
					if(activities_json[key].id == activity){
						loot = activities_json[key].drop;
					}
				}
			}

			let weightSum = loot.reduce((a, b) => a + (b['weight'] || 0), 0);
			let random = Math.floor(Math.random() * (weightSum - 0 + 1) + 0);
			let weight = 0;
			let currentDrop = 0;

			for(let i = 0; i < loot.length; i++) {
				weight += loot[i].weight;
				if(random <= weight){
					return currentDrop = items_json[loot[i].item];
					break;
				}
			}
		}

		//collectResource: Adds an item to inventory
		const collectResource = (drop) => {

			if(drop.stacks){
				updateStats(drop, stats, setStats)
				if(inventory.filter(e => e.id === drop.id).length > 0){
					let current_quantity = inventory[inventory.map(i => i.id).indexOf(drop.id)].quantity;
					const index = inventory.map(i => i.id).indexOf(drop.id);
					let new_inventory =  [...inventory];
					new_inventory[index].quantity = current_quantity + 1;
					setInventory(new_inventory);
				}else{
					setInventory(inventory.concat(drop))
				}
			}else{
				setInventory(inventory.concat(drop))
			}
		}

		const removeResource = (item) => {
			//find the index of the item to be removed in inventory
			let removeIndex = inventory.map(i => i.id).indexOf(item.id);
			console.log("remove index: ", removeIndex);
			//get the quantity of the item to be removeIndex
			let removeQuantity = inventory[removeIndex].quantity;
			console.log("quantity before removing: ", removeQuantity);
			//create a new inventory with the items quantity decremented
			let reducedInventory = [...inventory];

			if(removeQuantity > 1){
				reducedInventory[removeIndex].quantity = removeQuantity - 1;
			}
			if(removeQuantity === 1){
				//remove the item object from inventory
				reducedInventory = reducedInventory.filter(e => e !== reducedInventory[removeIndex])
				//delete reducedInventory[removeIndex]
			}
			setInventory(reducedInventory);

		}

		//updateStats:
		const updateStats = (drop, arr, setter) => {
			if (arr.filter(e => e.name === drop.experienceType).length > 0) {
				let current_experience = arr[arr.map(i => i.name).indexOf(drop.experienceType)].experience
				let stat_index = arr.map(i => i.name).indexOf(drop.experienceType)
				let new_stats = [...arr]
				new_stats[stat_index].experience = current_experience + drop.experience
				new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
				setter(new_stats)
			} else {
				let newStat = { name: drop.experienceType, experience: drop.experience, level: 1 }
				setter(arr.concat(newStat))
			}
		}
		const refineResource = (add, remove) => {
			//remove the item requirement from inventory
			removeResource(items_json[remove]);
			//updateStats(stats, setStats)
			collectResource(items_json[add]);

		}


		//doActivity:

		//get the type of the Activity
		let activityType = items_json[activity].type;

		//if the activity type is Collect
		if(activityType === "Collect"){
			let currentDrop = selectDrop()
			collectResource(currentDrop)

		//if the activity type is Refine
	}else if (activityType === 'Refine' || 'Cook') {

				//get the item requirement to refine
				let itemRequired = activities_json[activity].itemRequirement;
				let itemRequiredIndex = inventory.map(i => i.id).indexOf(itemRequired);
				let itemRequiredQuantity = inventory[itemRequiredIndex].quantity;
				let itemOutput = activities_json[activity].drop;

				if(itemRequiredQuantity > 1){
					refineResource(itemOutput, itemRequired)
				}
			}



		//if the activity type is Craft


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
