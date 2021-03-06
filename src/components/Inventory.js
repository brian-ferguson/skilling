import React, { useContext } from "react";
//import clsx from "clsx";

import { PlayerContext } from "../context";
import Item from "../components/Item";

const Inventory = props => {
	const playerContext = useContext(PlayerContext);
	const { inventory } = playerContext;

  return <div className="inventory" style={{width: 300, margin: 0}}>
		{/* Item Container */}
		<div style={{display: 'flex', flexWrap: 'wrap'}}>
			{inventory.map((item, index) => {
				return <div key={index} style={{width: 40, margin: '5px 0 0 5px', height: 40}}>
					<Item name={item.name} source={item.source} id={item.id} quantity={item.quantity}/>
				</div>

			})}
		</div>
    </div>
};

export default Inventory;
