import  React, { useContext } from "react";
import { PlayerContext } from "../context";

const Activity = (props) => {
	const playerContext = useContext(PlayerContext);

	const { doActivity } = playerContext;

	const handleActivity = e => {
		doActivity(e.target.id)
	}

	return <div onClick={handleActivity} style={{border: '1px solid black', width: 60, margin: '5px 0 0 5px', height: 60, cursor: 'pointer'}}>
		{/* Image */}
		<img
			id={props.id}
			src={process.env.PUBLIC_URL + props.source}
			alt=""
			style={{ width: 40, height: 40, paddingBottom: 5, marginLeft: 10 }}
		/>
	</div>
};

export default Activity;
