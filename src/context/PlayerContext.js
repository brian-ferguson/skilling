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

	//takes an item id and returns the id of that item in inventory
	const checkInventoryIndex = (id) => {
		return inventory.map(i => i.id).indexOf(id);
	}

	//takes an item id and returns the quantity of that item in inventory
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

	//takes the id of an item and returns the item object
	const getItemObject = (id) => {
		for (var key in items_json) {
			if (items_json.hasOwnProperty(key)) {
				if(items_json[key].id === id){
					return items_json[key]
				}
			}
		}
	}

	//takes the id of an activity (integer)
	const doActivity = (activity) => {

		//methods and functions
		//selectDrop: selects a item to drop from weighted probabilities
		const selectDrop = (itemList) => {
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
					//calculate the quantity to return
					let randomAmount = Math.floor(Math.random() * (loot[i].maximum - loot[i].minimum + 1) + loot[i].minimum);
					let returnItem = [{
						"id": loot[i].id,
						"quantity": randomAmount
					}];
					return returnItem
				}
			}


		}

		//updateInventory
		const updateInventory = (add, remove) => {
			//instantiate copy of current inventory
			let new_inventory =  [...inventory];
			//remove all the requirements
			if(remove !== undefined){
				for (let i = 0; i < remove.length; i++) {
					//check if the decrementing the current quantity would result in a delete or decrement
					if(checkInventory(remove[i].id) - remove[i].quantity !== 0){
						//decrement the quantity of the item in inventory
						new_inventory[checkInventoryIndex(remove[i].id)].quantity = new_inventory[checkInventoryIndex(remove[i].id)].quantity - remove[i].quantity;
					}else{
						//delete the item in inventory
						let temp = [...new_inventory]
						new_inventory = temp.filter(e => e !== temp[checkInventoryIndex(remove[i].id)])
					}
				}
			//add the new items to inventory
		}
			//for each item to add
			for(let j = 0; j < add.length; j++){
				//if the item to be collected does not exist in inventory
				if(checkInventoryIndex(add[j].id) === -1){
					//get the item object
					let addObject = getItemObject(add[j].id);
					addObject.quantity = add[j].quantity;
					//add the item to the inventory
					new_inventory.push(addObject);
				}else{
					new_inventory[checkInventoryIndex(add[j].id)].quantity = new_inventory[checkInventoryIndex(add[j].id)].quantity + add[j].quantity;
				}
			}
			//update state to the new inventory
			setInventory(new_inventory);
		}

		//updateStats:
		const updateStats = drop => {

			for(let i = 0; i < drop.length; i++){
				//get the item object by id
				let dropObject = getItemObject(drop[i].id)
				
				if (stats.filter(e => e.name === dropObject.experienceType).length > 0) {
					let current_experience = stats[stats.map(i => i.name).indexOf(dropObject.experienceType)].experience
					let stat_index = stats.map(i => i.name).indexOf(dropObject.experienceType)
					let new_stats = [...stats]
					new_stats[stat_index].experience = current_experience + dropObject.experience
					new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
					setStats(new_stats)
				} else {
					let newStat = { name: dropObject.experienceType, experience: dropObject.experience, level: 1 }
					setStats(stats.concat(newStat))
				}

			}


		}

		//doActivity:

		//get the type of the Activity
		let activityType = activities_json[activity].type;

		//if the activity type is Collect
		if(activityType === "Collect"){

			let currentDrop = selectDrop(activities_json[activity].drop)
			updateStats(currentDrop)
			setMessages([...messages, `You ${activityType.toLowerCase()} a ${currentDrop.name} and gain ${currentDrop.experience} ${currentDrop.experienceType} experience.`])
			updateInventory(currentDrop)

		//if the activity type is Refine
		}else if (activityType === 'Refine') {
			//check that the item requirements are in inventory
			let itemRequirements = activities_json[activity].itemRequirements
			let itemOutputs = activities_json[activity].drop;
			let check = checkInventoryRequirements(itemRequirements)

			if(check){
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
				setMessages([...messages, `You ${activityType.toLowerCase()} ${string} gained ${itemOutputs.experience} ${itemOutputs.experienceType} experience.`])
				updateStats(itemOutputs)
				updateInventory(itemOutputs, itemRequirements)
			}
		}
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
