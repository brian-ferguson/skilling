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

	//takes the id of an activity (integer)
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

		//checkInventory: takes an item id and returns the quantity of the item in inventory
		const checkInventory = (item) => {
			//get the index of the item in inventory
			let inventoryIndex = checkInventoryIndex(item);
			//if the index does not exist, return 0
			if(inventoryIndex === -1){
				return 0
			//if the index does exist, return the quantity
			}else{
				return inventory[inventoryIndex].quantity;
			}

		}

		//checkInventoryIndex: takes an item id and returns the inventory index
		const checkInventoryIndex = (id) => {
			return inventory.map(i => i.id).indexOf(id);
		}

		//updateInventory
		const updateInventory = (add, remove) => {

			//instantiate copy of current inventory
			let new_inventory =  [...inventory];

			//if remove is undefined, add or increment the item in inventoryIndex
			if(remove === undefined){

				//if the item to be collected does not exist in inventory
				if(checkInventoryIndex(add.id) === -1){
					//add the item to the inventory
					new_inventory.push(add);
				//if the item to be collected does exist in inventory
				}else{
					//increment the item quantity in inventory
					new_inventory[checkInventoryIndex(add.id)].quantity = new_inventory[checkInventoryIndex(add.id)].quantity + 1;
				}

			//if remove is defined (refine)
			}else{

				//if the quantity of the item to remove is 1
				if(checkInventory(remove.id) === 1){

					//if the quantity of the item to add is 0
					if(checkInventoryIndex(add.id) === -1){
						//delete the remove item from inventory and add the add item
						new_inventory = new_inventory.filter(e => e !== new_inventory[checkInventoryIndex(remove.id)])
						new_inventory.push(add);
					//if the quantity of the item to add is more than 0
					}else{
						//delete the remove item from inventory and increment the add item
						new_inventory[checkInventoryIndex(add.id)].quantity = new_inventory[checkInventoryIndex(add.id)].quantity + 1;
						new_inventory = new_inventory.filter(e => e !== new_inventory[checkInventoryIndex(remove.id)])
					}

				//if the quantity of the item to remove is greater than 1
				}else{
					//if the quantity of the item to add is 0
					if(checkInventory(add.id) === 0){
						//decrement the remove item from inventory and add the add item
						new_inventory[checkInventoryIndex(remove.id)].quantity = new_inventory[checkInventoryIndex(remove.id)].quantity - 1;
						new_inventory.push(add);
					//if the quantity of the item to add is greater than 0
					}else{
						//decrement the remove item from inventory and increment the add item
						new_inventory[checkInventoryIndex(remove.id)].quantity = new_inventory[checkInventoryIndex(remove.id)].quantity - 1;
						new_inventory[checkInventoryIndex(add.id)].quantity = new_inventory[checkInventoryIndex(add.id)].quantity + 1;
					}
				}
			}
			//update state to the new inventory
			setInventory(new_inventory);
		}

		//updateStats:
		const updateStats = drop => {
			if (stats.filter(e => e.name === drop.experienceType).length > 0) {
				let current_experience = stats[stats.map(i => i.name).indexOf(drop.experienceType)].experience
				let stat_index = stats.map(i => i.name).indexOf(drop.experienceType)
				let new_stats = [...stats]
				new_stats[stat_index].experience = current_experience + drop.experience
				new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
				setStats(new_stats)
			} else {
				let newStat = { name: drop.experienceType, experience: drop.experience, level: 1 }
				setStats(stats.concat(newStat))
			}
		}

		//doActivity:

		//get the type of the Activity
		let activityType = items_json[activity].type;

		//if the activity type is Collect
		if(activityType === "Collect"){
			let currentDrop = selectDrop()
			console.log("collect drop: ", currentDrop);
			//collectResource(currentDrop)
			updateInventory(currentDrop)
			updateStats(currentDrop)

		//if the activity type is Refine
	}else if (activityType === 'Refine' || 'Cook') {

				//get the item requirement to refine
				let itemRequiredID = activities_json[activity].itemRequirement;
				let itemRequired = items_json[itemRequiredID];
				let itemOutputID = activities_json[activity].drop;
				let itemOutput = items_json[itemOutputID];

				//if the required item exists in inventory
				if(checkInventoryIndex(itemRequiredID) != -1){
					updateInventory(itemOutput, itemRequired);
					updateStats(itemOutput)
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
