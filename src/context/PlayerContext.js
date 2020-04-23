import React, {createContext, useState} from "react";
import PropTypes from "prop-types";

//context
export const Context = createContext({});

//provider
export const Provider = props => {
	const { children } = props;

	const [inventory, setInventory] = useState([]);
	const [view, setView] = useState('Calm Beach')

	const addItem = (item) => {
		if(item.stacks){
			//if stacks is true, and the item is already in the inventory > increment the item quantity
			if(inventory.filter(e => e.id === item.id).length > 0){

				//get the quantity of the item in the players Inventory
				var current_quantity = inventory[inventory.map(i => i.id).indexOf(item.id)].quantity;
				//get the index of the item to be incremented
				const index = inventory.map(i => i.id).indexOf(item.id);

				var new_inventory =  [...inventory];
				new_inventory[index].quantity = current_quantity + 1;

				setInventory(new_inventory);


			//if stacks is true, and the item is not in the inventory > add the item to the inventory
			}else{
				setInventory(inventory.concat(item))
			}

		//if stacks is false, add the item to the players inventory
		}else{
			setInventory(inventory.concat(item))
		}
	};

	const playerContext = {
		inventory,
		setInventory,
		addItem,
		view,
		setView
	};

	return <Context.Provider value={playerContext}>{children}</Context.Provider>

};

//consumer
export const {Consumer} = Context;

//proptype validation
Provider.propTypes = {
  inventory: PropTypes.array,
  items: PropTypes.array,
};

Provider.defaultProps = {
  inventory: [],
  items: [],
};
