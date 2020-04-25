import React, { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import locations_json from '../json/locations.json'
import activities_json from '../json/activities.json'
import items_json from '../json/items.json'

//context
export const Context = createContext({});

//provider
export const Provider = props => {
	const { children } = props;

	const [inventory, setInventory] = useState([]);
	const [view, setView] = useState('Calm Beach')
	const [activities, setActivities] = useState(activities_json);
	const [locations, setLocations] = useState(locations_json);
	const [locationActivities, setLocationActivities] = useState([]);
	const items = items_json

	useEffect(() => {
		let currentLocations = Object.keys(locations[view])

		let currentLocationActivities = [];

		//get all the activities of the current location
		for (let i = 0; i < currentLocations.length; i++) {
			let currentActivity = activities[currentLocations[i]]
			currentLocationActivities.push(currentActivity)
		}

		if(currentLocationActivities){
			setLocationActivities(currentLocationActivities);
		}
	}, [activities, locations, view])

	const addItem = (activity) => {

		//get the item with the corresponding id
		let currentDrop = items[activity];

		if(currentDrop.stacks){
			//if stacks is true, and the item is already in the inventory > increment the item quantity
			if(inventory.filter(e => e.id === currentDrop.id).length > 0){

				//get the quantity of the item in the players Inventory
				var current_quantity = inventory[inventory.map(i => i.id).indexOf(currentDrop.id)].quantity;
				//get the index of the item to be incremented
				const index = inventory.map(i => i.id).indexOf(currentDrop.id);

				var new_inventory =  [...inventory];
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

	};

	const playerContext = {
		inventory,
		setInventory,
		addItem,
		view,
		setView,
		activities,
		setActivities,
		locations,
		setLocations,
		locationActivities,
		setLocationActivities,
	};

	return <Context.Provider value={playerContext}>{children}</Context.Provider>

};

//consumer
export const {Consumer} = Context;

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
