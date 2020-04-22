import  React, { useContext } from "react";
import {PlayerContext} from "../context";

const Area = (props) => {
	const playerContext = useContext(PlayerContext);

	const { addItem } = playerContext;
	// const { inventory, addItem } = playerContext;

	const handleRefresh = e => {
		var item_drop = props.drop;
		addItem(item_drop);
	}

	return <div style={{margin: 0, border: '1px solid green', width: 300}}>
		{/* Title */}
		<h2 style={{textAlign: 'center'}}>Area</h2>

		{/* Image */}
		<img
			id={props.id}
			onClick={handleRefresh}
			src={process.env.PUBLIC_URL + props.source}
			alt=""
			style={{ width: 24, height: 24, paddingBottom: 5, marginLeft: 10 }}
		/>
	</div>
};

export default Area;
