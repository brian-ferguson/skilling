import React, { useState, useEffect, createContext } from "react"
import PropTypes from "prop-types"
import { levelFormula } from '../tools/index'
import locations_json from '../json/locations.json'
import activities_json from '../json/activities.json'
import items_json from '../json/items.json'
import actions_json from '../json/actions.json'
import loots_json from '../json/loots.json'

export const Context = createContext({})

export const Provider = props => {

	const [locations, setLocations] = useState([])
	const [locationActivities, setLocationActivities] = useState([])
	const [locationActions, setLocationActions] = useState([])
	const [view, setView] = useState("cb881ee5-06fa-4272-9fe7-2937ab4e002a")
	const [work, setWork] = useState(false)
	const [messages, setMessages] = useState([])
	const [inventory, setInventory] = useState([])
	const [stats, setStats] = useState([])

	// eslint-disable-next-line
	useEffect(() => generateLocations(view), [view, inventory])

	const generateLocations = (view) => {
		//set the locations state object (restricted based on skill amount in a category)
		setLocations(locations_json["locations"])
		//get the game object of the current view location
		let currentLocation = getObject(view, locations_json["locations"])
		//get the activities of the current view location
		let currentLocationActivities = currentLocation.activities
		//instantiate an array to hold the activity objects of the current view location
		let activitiesObjects = []

		//for each activity id of the current view location
		for(let i=0; i<currentLocationActivities.length; i++){
			//get the activity object
			let activityObject = getObject(currentLocationActivities[i], activities_json["activities"])
			//add the activity object to activitiesObjects
			activitiesObjects.push(activityObject)
		}

		//if the list of current location activities is not 0
		if(activitiesObjects.length !== 0){
			//update the current location activities state
			setLocationActivities(activitiesObjects)
		}

		//instantiate an array to hold the available actions per activity
		let currentLocationActions = []

		//iterate through the list of activities at the current view location
		for(let j=0; j<activitiesObjects.length; j++){

			//get the actions of the activity
			let activityActions = activitiesObjects[j].actions
			//instantiate an array to hold the actions with item requirements met
			let availableActivityActions = []

			//for each action in the activity actions
			for(let k=0; k<activityActions.length; k++){
				//get the action object
				let actionObject = getObject(activityActions[k], actions_json["actions"])

				//if the action has item requirements
				if(actionObject.itemRequirements){

					if(checkInventoryRequirements(actionObject.itemRequirements) === true){
						availableActivityActions.push(actionObject)
					}

				}else{
					availableActivityActions.push(actionObject)
				}

			}

			//if the list of current location actions is not 0
			if(availableActivityActions){
				currentLocationActions.push(availableActivityActions)
			}

		}

		//if the list of current location actions is not 0
		if(currentLocationActions.length !== 0){
			setLocationActions(currentLocationActions)
		}
	}

	//takes an item id and returns the id of that item in inventory
	const checkInventoryIndex = (id) => {
		return inventory.map(i => i.id).indexOf(id)
	}

	//takes an item id and returns the quantity of that item in inventory
	const checkInventory = (item) => {
		let inventoryIndex = checkInventoryIndex(item)
		if(inventoryIndex === -1){
			return 0
		}else{
			return inventory[inventoryIndex].quantity
		}
	}

	//takes a list of item ids and quantities and returns true if found in inventory
	const checkInventoryRequirements = (list) => {
		//for each element in the list of item requirements
		for (let i = 0; i < list.length; i++) {
			//get the required id and quantity
			let requiredId = list[i].id
			let requiredQuantity = list[i].quantity
			//if the required id is not in inventory break and return false
			if(checkInventoryIndex(requiredId) === -1){
				return false
			//if the required id is in inventory
			}else{
				//if the required id is in inventory but the quantity requirment is not met break and return false
				if(checkInventory(requiredId) < requiredQuantity){
					return false
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

	//selectDrop: selects a item to drop from weighted probabilities
	const selectDrop = (loot) => {
		let weightSum = loot.reduce((a, b) => a + (b['weight'] || 0), 0)
		let random = Math.floor(Math.random() * (weightSum - 0 + 1) + 0)
		let weight = 0
		for(let i = 0; i < loot.length; i++) {
			weight += loot[i].weight
			if(random <= weight){
				//calculate the quantity to return
				let randomAmount = Math.floor(Math.random() * (loot[i].maximum - loot[i].minimum + 1) + loot[i].minimum)
				let returnItem = [{
					"id": loot[i].id,
					"quantity": randomAmount
				}]
				return returnItem
			}
		}
	}

	//updateInventory
	const updateInventory = (add, remove) => {

		//instantiate copy of current inventory
		let new_inventory =  [...inventory]

		//add the new items to inventory
		//for each item to add
		for(let j = 0; j < add.length; j++){
			//if the item to be collected does not exist in inventory
			if(checkInventoryIndex(add[j].id) === -1){
				//get the item object
				let addObject = getObject(add[j].id, items_json["items"])
				addObject.quantity = add[j].quantity
				//add the item to the inventory
				new_inventory.push(addObject)
			}else{
					new_inventory[checkInventoryIndex(add[j].id)].quantity = new_inventory[checkInventoryIndex(add[j].id)].quantity + add[j].quantity
			}
		}

		//remove all the requirements
		if(remove !== undefined){
			for (let i = 0; i < remove.length; i++) {
				//check if the decrementing the current quantity would result in a delete or decrement
				if(checkInventory(remove[i].id) - remove[i].quantity !== 0 && new_inventory[checkInventoryIndex(remove[i].id)]){
					//decrement the quantity of the item in inventory
					new_inventory[checkInventoryIndex(remove[i].id)].quantity = new_inventory[checkInventoryIndex(remove[i].id)].quantity - remove[i].quantity
				}else{
					//delete the item in inventory
					let temp1 = [...new_inventory]
					new_inventory = temp1.filter(e => e !== temp1[checkInventoryIndex(remove[i].id)])
				}
			}
		}
		//update state to the new inventory
		setInventory(new_inventory)
	}

	//updateStats
	const updateStats = drop => {
		if (stats.filter(e => e.name === drop).length > 0) {
			let current_experience = stats[stats.map(i => i.name).indexOf(drop)].experience
			let stat_index = stats.map(i => i.name).indexOf(drop)
			let new_stats = [...stats]
			new_stats[stat_index].experience = current_experience + 1
			new_stats[stat_index].level = levelFormula(new_stats[stat_index].experience)
			setStats(new_stats)
		} else {
			let newStat = { name: drop, experience: 1, level: 1 }
			setStats(stats.concat(newStat))
		}
	}

	//takes the id of an activity and action
	const doActivity = (activity, action) => {
		let lootList = null
		let activityId = null;
		let actionId = null;

		//get the loot list object of the activity and objects
		for(let i=0; i<loots_json["loots"].length; i++){
			//get the activity and action id of each loop
			activityId = loots_json["loots"][i].activityId
			actionId = loots_json["loots"][i].actionId

			//if the activity and action ids passed from click are equal to the respective loots foreign keys
			if(activityId === activity && actionId === action){
				//get the loot list objects
			  lootList = loots_json["loots"][i].loot
				break
			}
		}

		//get the current drop and quantity
		let currentDrop = selectDrop(lootList)

		//get the action object from the id passed to doActivity
		let actionObject = getObject(action, actions_json["actions"])
		let activityObject = getObject(activityId, activities_json["activities"])
		//update inventory
		updateInventory(currentDrop, actionObject.itemRequirements)
		//update the set
		updateStats(activityObject.type)
	}

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
		setLocationActions,
		getObject

	}

	return <Context.Provider value={playerContext}>{props.children}</Context.Provider>

}

//consumer
export const { Consumer } = Context

//proptype validation
Provider.propTypes = {
	inventory: PropTypes.array,
	items: PropTypes.array,
	locations: PropTypes.array,
}

Provider.defaultProps = {
	inventory: [],
	items: [],
	locations: [],
}
