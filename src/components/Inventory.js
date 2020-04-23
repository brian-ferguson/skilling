import React, { useContext } from "react";
//import clsx from "clsx";

import { PlayerContext } from "../context";
import Item from "../components/Item";

const Inventory = props => {
	const playerContext = useContext(PlayerContext);
	const { inventory } = playerContext;

  return <div className="inventory" style={{borderLeft: '1px solid black', width: 300, margin: 0}}>
		{/* Title */}
    	<h2 style={{textAlign: 'center'}}>Inventory</h2>

		{/* Item Container */}
		<div style={{display: 'flex', flexWrap: 'wrap'}}>
			{inventory.map((item, index) => {
				return <div key={index} style={{border: '1px solid black', width: 40, margin: '5px 0 0 5px', height: 40}}>
					<Item name={item.name} source={item.source} id={item.id} stacks={item.stacks} quantity={item.quantity}/>
				</div>

			})}
		</div>
    </div>
};

export default Inventory;
