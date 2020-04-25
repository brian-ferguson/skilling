import  React, { useContext } from "react";
import {PlayerContext} from "../context";

const Activity = (props) => {
	const playerContext = useContext(PlayerContext);

	const { addItem } = playerContext;
	// const { inventory, addItem } = playerContext;

	const handleRefresh = e => {

		//var item_drop = props.drop;
		addItem(e.target.id);
	}

	return <div style={{border: '1px solid black', width: 40, margin: '5px 0 0 5px', height: 40}}>
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

export default Activity;
