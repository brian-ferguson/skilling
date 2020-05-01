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
	const [work, setWork] = useState(false)
	const [messages, setMessages] = useState([])

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

	const checkInventoryIndex = (id) => {
		return inventory.map(i => i.id).indexOf(id);
	}

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

	const checkInventoryRequirements = (list) => {
		//for each element in the list of item requirements
		for (let i = 0; i < list.length; i++) {
			//get the required id and quantity
			let requiredId = list[i].id;
			let requiredQuantity = list[i].quantity;
			//if the required id is not in inventory break and return false
			if(checkInventoryIndex(requiredId) === -1){
				return false;
			//if the required id is in inventory
			}else{
				//if the required id is in inventory but the quantity requirment is not met break and return false
				if(checkInventory(requiredId) < requiredQuantity){
					return false;
				//if the required id is in inventory and the quantity is greater than or equal to required quantity continue
				}
			}
		}
		//return true
		return true
	}


	//takes the id of an activity (integer)
	const doActivity = (activity) => {

		//methods and functions
		//selectDrop: selects a item to drop from weighted probabilities
		const selectDrop = () => {
			let loot = null;
			for (var key in activities_json) {
				if (activities_json.hasOwnProperty(key)) {
					if(activities_json[key].id === parseInt(activity)){
						loot = activities_json[key].drop;
					}
				}
			}
			let weightSum = loot.reduce((a, b) => a + (b['weight'] || 0), 0);
			let random = Math.floor(Math.random() * (weightSum - 0 + 1) + 0);
			let weight = 0;

			for(let i = 0; i < loot.length; i++) {

				weight += loot[i].weight;
				if(random <= weight){
					return items_json[loot[i].item]
				}
			}
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

				//add the items
				//add the new items

				if(checkInventoryIndex(add.id) === -1){
					//add the item to the inventory
					new_inventory.push(add);
				//if the item to be collected does exist in inventory
				}else{
					//increment the item quantity in inventory
					new_inventory[checkInventoryIndex(add.id)].quantity = new_inventory[checkInventoryIndex(add.id)].quantity + 1;
				}
				

				//for each required item and quantity
				for (let i = 0; i < remove.length; i++) {
					//if the item quantity to remove results in 0 quantity in inventory
					if(checkInventory(remove[i].id) - remove[i].quantity === 0){
						//delete the element from inventory
						let temp = [...new_inventory]
						new_inventory = temp.filter(e => e !== temp[checkInventoryIndex(remove[i].id)])
					//if the item quantity to remove results in 1 or more quantity in inventory
					}else{
						//decrement the item from inventory
						new_inventory[checkInventoryIndex(remove[i].id)].quantity = new_inventory[checkInventoryIndex(remove[i].id)].quantity - remove[i].quantity;
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
			setMessages([...messages, `You ${activityType.toLowerCase()} a ${currentDrop.name} and gain ${currentDrop.experience} ${currentDrop.experienceType} experience.`])
			//collectResource(currentDrop)
			updateInventory(currentDrop)
			updateStats(currentDrop)

		//if the activity type is Refine
	}else if (activityType === 'Refine' || 'Cook') {

		let itemRequirements = activities_json[activity].itemRequirements
		let itemOutputID = activities_json[activity].drop;
		let itemOutput = items_json[itemOutputID];
		//check if the required item(s) are in inventory
		let check = checkInventoryRequirements(itemRequirements)

		if(check === true){

			let string = ''
				
			for (let i = 0; i < itemRequirements.length; i++) {
				string = string.concat(itemRequirements[i].quantity + ' ')
				string = string.concat(items_json[itemRequirements[i].id].name)
				if (i + 2 >= itemRequirements.length) {
					string = string.concat(' and ')
				} else {
					string = string.concat(', ')
				}
			}
			//update inventory
			updateInventory(itemOutput, itemRequirements);
			setMessages([...messages, `You ${activityType.toLowerCase()} ${string} gained ${itemOutput.experience} ${itemOutput.experienceType} experience.`])
			//updateStats(itemOutput)
		}

				/*
				//get the item requirement to refine
				let itemRequiredID = activities_json[activity].itemRequirement;
				let itemRequired = items_json[itemRequiredID];

				let itemOutput = items_json[itemOutputID];

				//if the required item exists in inventory
				if(checkInventoryIndex(itemRequiredID) !== -1){
					updateInventory(itemOutput, itemRequired);
					updateStats(itemOutput)
				}
				*/
			}



		//if the activity type is Craft


	};

	const playerContext = {
		inventory,
		setInventory,
		doActivity,
		messages,
		setMessages,
		view,
		setView,
		work,
		setWork,
		stats,
		locationActivities,
		setLocationActivities,
		checkInventoryRequirements
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
