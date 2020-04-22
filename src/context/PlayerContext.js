import React, {createContext, useState, useEffect} from "react";
import PropTypes from "prop-types";
import JSONTestItems from '../initial_inventory.json';

//context
export const Context = createContext({});

//provider
export const Provider = props => {
  const {
    items: initialItems,
    inventory: initialInventory,
    children
  } = props;

  const [inventory, setInventory] = useState(initialInventory);
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setInventory(initialInventory);
    setItems(JSONTestItems);

  }, [initialInventory]);

	const addItem = (item) => {
		setInventory(inventory.concat(item))
	};

	const playerContext = {
		inventory,
		setInventory,
		addItem,
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
