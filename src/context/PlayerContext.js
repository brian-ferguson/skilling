import React, { useState, useEffect, createContext } from "react"
import PropTypes from "prop-types"
import locations_json from '../json/locations.json'
import activities_json from '../json/activities.json'
import items_json from '../json/items.json'
import actions_json from '../json/actions.json'
import loots_json from '../json/loots.json'

export const Context = createContext({});

export const Provider = props => {

	const [locations, setLocations] = useState([]);
	const [locationActivities, setLocationActivities] = useState([])
	const [locationActions, setLocationActions] = useState([])
	const [view, setView] = useState("cb881ee5-06fa-4272-9fe7-2937ab4e002a")
	const [work, setWork] = useState(false)
	const [messages, setMessages] = useState([])
	const [inventory, setInventory] = useState([])
	const [stats, setStats] = useState([])

	useEffect(() => {

		//initialize an array to hold the available location objects
		let currentLocations = [];
		//initialize an array to hold the current view location activities
		let currentLocationActivities = [];
		//initialize an array to hold the current location activity actions
		let currentLocationActions = [];

		//iterate through the game locations
		for(let i=0; i<locations_json["locations"].length; i++){
			//add the location object at the current index to currentLocations
			currentLocations.push(locations_json["locations"][i]);

			//if the location object at the current index id is equal to the view id
			if(locations_json["locations"][i].id === view){

				//iterate through the activities of the current view location
				for(let j=0; j<locations_json["locations"][i].activities.length; j++){

					//iterate through the activity objects at the view location
					for(let k=0; k<activities_json["activities"].length; k++){

						//if the id of the activity of the current view location is equal to the id the game object activity
						if(activities_json["activities"][k].id === locations_json["locations"][i].activities[j]){

							//instantiate an array to hold the actions of each activity
							let currentActivityActions = [];

							//add the activity to the list of location activities
							currentLocationActivities.push(activities_json["activities"][k]);

							//iterate through the the activity actions
							for(let l=0; l<activities_json["activities"][k].actions.length; l++){

								//iterate through the actions
								for(let m=0; m<actions_json["actions"].length; m++){
									//if the activity action id and the action id are equal
									if(actions_json["actions"][m].id === activities_json["activities"][k].actions[l]){

										if(actions_json["actions"][m].itemRequirements !== undefined){
											//check if the item requirements are met
											if(checkInventoryRequirements(actions_json["actions"][m].itemRequirements)){
												//currentActivityActions.push(actions_json["actions"][m]);
											}
											currentActivityActions.push(actions_json["actions"][m]);

										}else{
											console.log("undefined");
											//add the action
											//currentActivityActions.push(actions_json["actions"][m]);
										}

									}//ends if activity and action equal ids



								}//ends json action iteration



							}

							//add the current activity actions to currentLocationActions
							if(currentActivityActions.length !== 0){
								currentLocationActions.push(currentActivityActions);
							}

						}




					}
				}
			}//equal view id
		}

		//if the list of locations is not 0
		if(currentLocations.length !== 0){
			//update the locations state
			setLocations(currentLocations);
		}

		//if the list of current location activities is not 0
		if(currentLocationActivities.length !== 0){
			//update the current location activities state
			setLocationActivities(currentLocationActivities);
		}

		//if the list of current location actions is not 0
		if(currentLocationActions.length !== 0){
			setLocationActions(currentLocationActions);
		}

	}, [view])

	//takes an amount of experience and returns the equivalent level amount
	const levelFormula = (exp) => {
		return Math.floor(Math.sqrt(exp) * 1.2);
	};

	//takes an item id and returns the id of that item in inventory
	const checkInventoryIndex = (id) => {
		return inventory.map(i => i.id).indexOf(id);
	}

	//takes an item id and returns the quantity of that item in inventory
	const checkInventory = (item) => {
		let inventoryIndex = checkInventoryIndex(item);
		if(inventoryIndex === -1){
			return 0
		}else{
			return inventory[inventoryIndex].quantity;
		}
	}

	//takes a list of item ids and quantities and returns true if found in inventory
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

	//takes and id and json object and returns the corresponding object
	const getObject = (id, objectList) => {
		for (var key in objectList) {
			if (objectList.hasOwnProperty(key)) {
				if(objectList[key].id === id){
					return objectList[key]
				}
			}
		}
	}

	//takes the id of an activity and action
	const doActivity = (activity, action) => {
		//methods and functions
		//selectDrop: selects a item to drop from weighted probabilities
		const selectDrop = (loot) => {
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
			/*
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
		}*/
			//add the new items to inventory
			//for each item to add
			for(let j = 0; j < add.length; j++){
				//if the item to be collected does not exist in inventory
				if(checkInventoryIndex(add[j].id) === -1){
					//get the item object
					let addObject = getObject(add[j].id, items_json["items"]);
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
				let dropObject = getObject(drop[i].id, items_json)

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

		let lootList = null;

		//get the loot list object of the activity and objects
		for(let i=0; i<loots_json["loots"].length; i++){
			//get the activity and action id of each loop
			let activityId = loots_json["loots"][i].activityId;
			let actionId = loots_json["loots"][i].actionId;

			//if the activity and action ids passed from click are equal to the respective loots foreign keys
			if(activityId === activity && actionId === action){
				//get the loot list objects
			  lootList = loots_json["loots"][i].loot;
			}
		}

		//get the current drop and quantity
		let currentDrop = selectDrop(lootList)
		//get the item requirement list to remove
		console.log("current drop: ", currentDrop);

		//get the action object from the id passed to doActivity
		let actionObject = getObject(action, actions_json["actions"]);
		console.log("action object: ", actionObject);

		//update inventory
		updateInventory(currentDrop);

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
		checkInventoryRequirements,
		locations,
		setLocations,
		locationActions,
		setLocationActions

	};

	return <Context.Provider value={playerContext}>{props.children}</Context.Provider>

};

//consumer
export const { Consumer } = Context;

//proptype validation
Provider.propTypes = {
  inventory: PropTypes.array,
  items: PropTypes.array,
	locations: PropTypes.array,
};

Provider.defaultProps = {
  inventory: [],
  items: [],
	locations: [],
};
